import React, { useEffect, useMemo, useState, ChangeEvent } from "react";
import { supabase } from "../lib/supabase";

type Frequency = "weekly" | "biweekly" | "monthly";

type Product = {
    id: string;
    name: string;
    tag: string | null;
    price_ron: number;
    is_active: boolean;
    frequencies: Frequency[];
    image_url: string | null;
    created_at?: string;
};

type EditingProduct = Omit<Product, "price_ron" | "is_active" | "frequencies"> & {
    price_ron: number | "";
    is_active: boolean;
    frequencies: Frequency[];
};

const FREQUENCY_LABELS: Record<Frequency, string> = {
    weekly: "Weekly",
    biweekly: "Every 2 weeks",
    monthly: "Monthly",
};

export const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // ----------------- LOAD PRODUCTS FROM DB -----------------
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                setError("Failed to load products.");
            } else {
                setProducts(
                    (data || []).map((p) => ({
                        ...p,
                        // safety for frequencies type
                        frequencies: (p.frequencies ?? ["weekly"]) as Frequency[],
                    }))
                );
            }
            setLoading(false);
        };

        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return products;
        const q = search.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.tag ?? "").toLowerCase().includes(q)
        );
    }, [products, search]);

    // ----------------- MODAL HANDLERS -----------------
    const openCreateModal = () => {
        setIsCreating(true);
        const newProduct: EditingProduct = {
            id: crypto.randomUUID(),
            name: "",
            tag: "",
            price_ron: "",
            is_active: true,
            frequencies: ["weekly"],
            image_url: null,
        };
        setEditingProduct(newProduct);
        setImageFile(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setIsCreating(false);
        setEditingProduct({
            ...product,
            price_ron: product.price_ron,
            tag: product.tag ?? "",
        });
        setImageFile(null);
        setImagePreview(product.image_url ?? null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview(null);
        setIsCreating(false);
    };

    // ----------------- IMAGE HANDLING -----------------
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const uploadImageIfNeeded = async (
        existingUrl: string | null
    ): Promise<string | null> => {
        // If no new file selected, keep existing
        if (!imageFile) return existingUrl;

        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${editingProduct?.id}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("product-images") // bucket name
            .upload(filePath, imageFile, {
                cacheControl: "3600",
                upsert: true,
            });

        if (uploadError) {
            console.error(uploadError);
            throw new Error("Failed to upload product image.");
        }

        // Get public URL
        const { data: publicData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);

        return publicData.publicUrl ?? null;
    };

    // ----------------- SAVE PRODUCT -----------------
    const handleSaveProduct = async () => {
        if (!editingProduct) return;

        if (!editingProduct.name.trim()) {
            alert("Product name is required.");
            return;
        }
        if (!editingProduct.price_ron || editingProduct.price_ron <= 0) {
            alert("Price must be greater than 0.");
            return;
        }
        if (editingProduct.frequencies.length === 0) {
            alert("Select at least one billing frequency.");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const imageUrl = await uploadImageIfNeeded(editingProduct.image_url);

            const payload = {
                name: editingProduct.name.trim(),
                tag: editingProduct.tag?.trim() || null,
                price_ron: Number(editingProduct.price_ron),
                is_active: editingProduct.is_active,
                frequencies: editingProduct.frequencies,
                image_url: imageUrl,
            };

            const { data, error } = await supabase
                .from("products")
                .upsert(
                    {
                        id: isCreating ? undefined : editingProduct.id,
                        ...payload,
                    },
                    { onConflict: "id" }
                )
                .select()
                .single();

            if (error) throw error;

            const saved: Product = {
                ...data,
                frequencies: (data.frequencies ?? ["weekly"]) as Frequency[],
            };

            setProducts((prev) => {
                const exists = prev.some((p) => p.id === saved.id);
                if (exists) {
                    return prev.map((p) => (p.id === saved.id ? saved : p));
                }
                return [saved, ...prev];
            });

            closeModal();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to save product.");
        } finally {
            setSaving(false);
        }
    };

    // ----------------- DELETE / TOGGLE ACTIVE -----------------
    const handleDeleteProduct = async (id: string) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;
        const ok = confirm(
            `Are you sure you want to delete "${product.name}" from the catalog?`
        );
        if (!ok) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            console.error(error);
            setError("Failed to delete product.");
            return;
        }

        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const toggleActive = async (id: string) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;

        const newValue = !product.is_active;
        const { error } = await supabase
            .from("products")
            .update({ is_active: newValue })
            .eq("id", id);

        if (error) {
            console.error(error);
            setError("Failed to update product status.");
            return;
        }

        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, is_active: newValue } : p))
        );
    };

    const toggleFrequency = (freq: Frequency) => {
        if (!editingProduct) return;
        const has = editingProduct.frequencies.includes(freq);
        const updated = has
            ? editingProduct.frequencies.filter((f) => f !== freq)
            : [...editingProduct.frequencies, freq];

        setEditingProduct({ ...editingProduct, frequencies: updated });
    };

    // ----------------- RENDER -----------------
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Greenmart Admin – Products
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage subscription products stored in your database.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        + Add product
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        {loading && <span>Loading products…</span>}
                        {!loading && (
                            <span>
                                {filteredProducts.length} product
                                {filteredProducts.length === 1 ? "" : "s"} shown
                            </span>
                        )}
                        {error && <span className="text-red-500">{error}</span>}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Price (RON)
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Frequencies
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Active
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!loading && filteredProducts.length === 0) && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-sm text-slate-500"
                                    >
                                        No products found. Try adjusting your search or{" "}
                                        <button
                                            className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                                            onClick={openCreateModal}
                                        >
                                            add a new product
                                        </button>
                                        .
                                    </td>
                                </tr>
                            )}

                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/60">
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex gap-3">
                                            {product.image_url && (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-12 w-12 flex-shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">
                                                    {product.name}
                                                </span>
                                                {product.tag && (
                                                    <span className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                                        {product.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-sm text-slate-800">
                                        {product.price_ron.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 align-top text-xs text-slate-700">
                                        <div className="flex flex-wrap gap-1">
                                            {product.frequencies.map((f) => (
                                                <span
                                                    key={f}
                                                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                                                >
                                                    {FREQUENCY_LABELS[f]}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-center">
                                        <button
                                            onClick={() => toggleActive(product.id)}
                                            className={`inline-flex h-6 w-11 items-center rounded-full border transition ${product.is_active
                                                ? "border-emerald-500 bg-emerald-500"
                                                : "border-slate-300 bg-slate-200"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${product.is_active
                                                    ? "translate-x-5"
                                                    : "translate-x-0.5"
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 align-top text-right text-sm">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="mr-2 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-sm text-slate-500"
                                    >
                                        Loading…
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
                        <div className="mb-4 flex items-start justify-between gap-2">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    {isCreating ? "Add product" : "Edit product"}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Stored in your database and used for recurring subscriptions.
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="e.g. Morcovi bio"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    tag
                                </label>
                                <textarea
                                    value={editingProduct.tag ?? ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            tag: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    rows={3}
                                    placeholder="Short tag shown in admin / UI."
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Price (RON)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={0.5}
                                        value={editingProduct.price_ron}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                price_ron: e.target.value === "" ? "" : Number(e.target.value),
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Active
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setEditingProduct({
                                                    ...editingProduct,
                                                    is_active: !editingProduct.is_active,
                                                })
                                            }
                                            className={`inline-flex h-6 w-11 items-center rounded-full border transition ${editingProduct.is_active
                                                ? "border-emerald-500 bg-emerald-500"
                                                : "border-slate-300 bg-slate-200"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${editingProduct.is_active
                                                    ? "translate-x-5"
                                                    : "translate-x-0.5"
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-xs text-slate-600">
                                            {editingProduct.is_active ? "Visible in UI" : "Hidden"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Available billing frequencies
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((freq) => {
                                        const selected = editingProduct.frequencies.includes(freq);
                                        return (
                                            <button
                                                key={freq}
                                                type="button"
                                                onClick={() => toggleFrequency(freq)}
                                                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${selected
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {FREQUENCY_LABELS[freq]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Product image
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                                        <span>Upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                disabled={saving}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {saving ? "Saving…" : "Save product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

import { useState } from "react";

type OptionProps = {
    header: string;
    text: string;
    image: string;
    alt?: string;
    selected: boolean;
    onSelect: () => void;
};

export function Option({ header, text, image, alt, selected, onSelect }: OptionProps) {
    const id = `offer-${header.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return (
        <article className="mx-auto mr-2">
            <div className={`relative mx-10 md:mx-0 md:w-80 sm:30`}>
                <label htmlFor={id} className="relative block cursor-pointer">
                    <div className={`card transition-all duration-150 ease-in-out px-4 ${selected ? "border-farm-green ring-2 ring-farm-green/30 ring-offset-2 ring-offset-white" : "border border-gray-200"}`}>
                        <img
                            src={image}
                            alt={alt}
                            style={{ display: image ? "block" : "none" }}
                            className="md:h-48 md:w-48 h-48 w-48 object-cover rounded-lg flex-shrink-0 mx-auto"
                        />
                        <div className={`${image ? "pb-4" : "py-8"}`}>
                            <div className="flex items-center">
                                <h4 className={` ${image ? "" : ""}text-xl font-bold text-farm-dark mr-[20%]`}>{header}</h4>
                                <input
                                    id={id}
                                    type="radio"
                                    name="offer"
                                    value={header}
                                    className="peer w-4 h-4 accent-farm-green z-10 ml-auto"
                                    checked={selected}
                                    onChange={onSelect}
                                />
                            </div>
                            <h2 className={`text-farm-green font-bold ${alt ? "display-block" : "display-none"}`}>{alt}</h2>
                            <p className="text-gray-700 mt-2 text-base">{text}</p>
                        </div>
                    </div>
                </label>
            </div>
        </article >
    );
}

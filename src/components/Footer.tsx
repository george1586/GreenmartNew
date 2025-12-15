export function Footer() {
return(
    < footer className="border-t" >
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div>© {new Date().getFullYear()} GreenMart</div>
                <div className="flex gap-4">
                    <a href="/termeni" className="hover:text-farm-dark">Termeni</a>
                    <a href="/confidentialitate" className="hover:text-farm-dark">Confidențialitate</a>
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-center md:text-left">
                <p>
                    <span className="font-medium">Email:</span>{" "}
                    <a href="mailto:greenmart@writeme.com" className="hover:text-farm-dark">greenmart@writeme.com</a>
                </p>
                <p><span className="font-medium">Telefon:</span> +40 742 220 938</p>
            </div>
        </div>
    </footer >
)
}
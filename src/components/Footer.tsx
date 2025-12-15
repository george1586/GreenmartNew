export function Footer() {
    return (
        < footer className="border-t bg-[#006835] text-white ">
            <div className="flex-col items-center justify-center mt-8 mb-4 flex gap-4">
                <div className="flex flex-col items-center justify-center gap-8 mx-8 text-center text-lg">
                    <h3>Our activity is sponsored by inVest - Urban Mobility Accelerator, a programme co-founded by EIT Urban Mobility and ADR Vest. </h3>
                    <div className="flex-row flex gap-8 flex-wrap">
                        <img src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/InVest%20Logo_tagline_editabil-5.png" className="h-12 w-48"></img>
                        <img src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/Reversed%20Combined%20Logo.png" className="h-12 "></img>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-white flex flex-col gap-6">
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
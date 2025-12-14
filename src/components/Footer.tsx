import { Leaf } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                    {/* Brand */}
                    <div className="flex flex-col gap-4 max-w-xs">
                        <div className="flex items-center gap-2">
                            <div className="bg-farm-green/10 p-2 rounded-lg">
                                <Leaf className="h-6 w-6 text-farm-green" aria-hidden="true" />
                            </div>
                            <span className="text-2xl font-display font-extrabold text-farm-dark">Green<span className="text-farm-green">Mart</span></span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Aducem prospețimea fermelor locale direct la ușa ta. Susținem comunitatea și alimentația sănătoasă.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-sm">
                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-farm-dark">Legal</h4>
                            <a href="/termeni" className="text-gray-600 hover:text-farm-green transition-colors">Termeni și condiții</a>
                            <a href="/confidentialitate" className="text-gray-600 hover:text-farm-green transition-colors">Confidențialitate</a>
                            <a href="https://anpc.ro/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-farm-green transition-colors">ANPC</a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-farm-dark">Contact</h4>
                            <a href="mailto:greenmart@writeme.com" className="text-gray-600 hover:text-farm-green transition-colors">greenmart@writeme.com</a>
                            <span className="text-gray-600">+40 742 220 938</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
                    <p>© {new Date().getFullYear()} GreenMart. Toate drepturile rezervate.</p>
                    <p>Creat cu ❤️ în Timișoara</p>
                </div>
            </div>
        </footer>
    )
}
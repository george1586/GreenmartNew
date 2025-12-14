import { Star } from "lucide-react";

export function Offer() {
    return (
        <div className="bg-farm-dark text-white text-center py-2.5 px-4 text-sm font-medium relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-center gap-2 animate-pulse">
                <Star className="h-4 w-4 text-farm-accent fill-farm-accent" />
                <span>Ultima șansă! Oferta de sărbători se termină pe 25/12.</span>
                <Star className="h-4 w-4 text-farm-accent fill-farm-accent" />
            </div>
        </div>
    );
}
  
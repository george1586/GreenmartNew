import React from "react";
import { Check } from "lucide-react";

interface SelectionCardProps {
    title: string;
    description: string;
    price?: string;
    details?: string; // e.g. "3-5kg"
    selected: boolean;
    onSelect: () => void;
    image?: string;
}

export function SelectionCard({ title, description, price, details, selected, onSelect, image }: SelectionCardProps) {
    return (
        <div 
            onClick={onSelect}
            className={`
                cursor-pointer group relative flex flex-col md:flex-row items-center md:items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200
                ${selected 
                    ? "border-farm-green bg-farm-light/30 shadow-md" 
                    : "border-gray-100 bg-white hover:border-farm-green/40 hover:shadow-sm"
                }
            `}
        >
            {image && (
                <div className="shrink-0">
                    <img src={image} alt={title} className="h-20 w-20 rounded-lg object-cover bg-gray-100" />
                </div>
            )}
            
            <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                    <h3 className="font-bold text-lg text-farm-dark">{title}</h3>
                    {price && <span className="font-bold text-farm-green">{price}</span>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{description}</p>
                {details && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded-md">
                        {details}
                    </span>
                )}
            </div>

            <div className={`
                shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors mt-2 md:mt-0
                ${selected ? "border-farm-green bg-farm-green text-white" : "border-gray-300 group-hover:border-farm-green"}
            `}>
                {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </div>
        </div>
    )
}

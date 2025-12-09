import { Leaf } from "lucide-react";
import { Offer } from "../components/Offer";

export function Specific() {
    return (<>
        <div className="flex flex-col mb-16">
            <Offer></Offer>
            <div className="flex flex-wrap items-center gap-2 mt-6 justify-center w-full">
                <div className="flex items-center min-w-0">
                    <Leaf className="h-8 w-8 mr-1 min-w-0" aria-hidden="true" />
                    <span className="text-3xl font-bold text-farm-dark min-w-0 ">Green</span>
                    <span className="text-3xl font-bold text-farm-green min-w-0 ">Mart</span>
                </div>
            </div>
            <div className="mt-6 flex flex-col items-center px-6 gap-4">
                <h2 className="text-center font-bold text-3xl">Selecteaza preferinta ta</h2>
                <h3 className="text-center font-bold text-gray-700 md:max-w-[50%] sm:max-w-[75%]">Alege dintre produse artizanale (ex.: gemuri, zacusca, conserve) fructe si legume</h3>
            </div>
        </div>
    </>)
}
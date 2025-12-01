import { Leaf } from "lucide-react";
import { Offer } from "../components/Offer";
import { Option } from "../components/FreeOptions";
import { Footer } from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSession } from "../hooks/useSession";

export function DeliveryAndSize() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [freq, setFreq] = useState("");
    const [opt, setOpt] = useState("");
    const { checkSession, updateSession } = useSession();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        if (!freq || !opt) {
            setError("Alege cantitatea si frecventa livrarii");
            setLoading(false);
            return;
        }
        try {
            updateSession({ freq: freq, size: opt });
            navigate("/specific");
        }
        catch (error) {
            setLoading(false);
            throw error;
        }
    }
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
                <h2 className="text-center font-bold text-3xl">Alege marimea pachetului</h2>
                <h3 className="text-center font-bold text-gray-700 md:max-w-[50%] sm:max-w-[75%]">Indiferent de marime, livrarea este mereu gratuita!</h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 mt-12" method="post">
                <div className="flex flex-wrap gap-4 mx-auto mb-8">
                    <Option header="Cutie Medie" alt="96 de lei" text="Potrivit pentru o persoana si familii mici. (3-5 kg de produse)﻿" image="" selected={opt === "Medie"} onSelect={() => setOpt("Medie")}></Option>
                    <Option header="Cutie Mare" alt="179 de lei" text="Potrivit pentru familli mai mari. (7-10 kg de produse)﻿" image="" selected={opt === "Mare"} onSelect={() => setOpt("Mare")}></Option>
                </div>
                <h2 className="text-center font-bold text-3xl">Cat de des?</h2>
                <h3 className="text-center font-bold text-gray-700 md:max-w-[75%] sm:max-w-[75%]">O sa iti livram un pachet <p style={{ all: "unset" }}>{freq}</p><br />(Poti pune pauza sau anula oricand).</h3>
                <div className="mt-4 flex flex-col justify-center gap-2">
                    <div className="flex items-center">
                        <input
                            id="rand0"
                            type="radio"
                            name="deliveryRate"
                            value="saptamanal"
                            className="peer w-4 h-4 accent-farm-green z-10 mr-2"
                            checked={(freq === "saptamanal")}
                            onChange={(e) => setFreq(e.target.value)}
                        />
                        <label htmlFor="rand0" className="text-gray-700 text-base font-base">Saptamanal</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="rand1"
                            type="radio"
                            name="deliveryRate"
                            value="bisaptamanal"
                            className="peer w-4 h-4 accent-farm-green z-10 mr-2"
                            checked={(freq === "bisaptamanal")}
                            onChange={(e) => setFreq(e.target.value)}
                        />
                        <label htmlFor="rand1" className="text-gray-700 text-base font-base">La doua saptamani</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="rand2"
                            type="radio"
                            name="deliveryRate"
                            value="lunar"
                            className="peer w-4 h-4 accent-farm-green z-10 mr-2"
                            checked={(freq === "lunar")}
                            onChange={(e) => setFreq(e.target.value)}
                        />
                        <label htmlFor="rand2" className="text-gray-700 text-base font-base">Lunar</label>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                        <button type="button" disabled={loading} onClick={handleSubmit}
                            className="btn btn-primary">
                            ALEGE MARIMEA CUTIEI
                        </button>
                    </div>
                </div>
                <p className={`text-red-700 text-center ${error ? "display-none" : "display-block"}`}>{error}</p>
            </form >
        </div >
        <Footer></Footer>
    </>
    );
}
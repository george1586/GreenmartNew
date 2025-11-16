import { supabase } from "../lib/supabase";
import { Offer } from "../components/Offer";
import { Leaf } from "lucide-react";
import { Option } from "../components/FreeOptions";
import { useState } from "react";

export function GetStarted() {
    const [offer, setOffer] = useState('');
    const [email, setEmail] = useState('');
    return (
        <>
            <div className="flex flex-col">
                <Offer></Offer>
                <div className="flex flex-wrap items-center gap-2 mt-6 justify-center w-full">
                    <div className="flex items-center min-w-0">
                        <Leaf className="h-8 w-8 mr-1 min-w-0" aria-hidden="true" />
                        <span className="text-3xl font-bold text-farm-dark min-w-0 ">Green</span>
                        <span className="text-3xl font-bold text-farm-green min-w-0 ">Mart</span>
                    </div>
                </div>
                <div className="mt-6 flex flex-col items-center px-6 gap-4">
                    <h2 className="text-center font-bold text-3xl">Alege oferta gratuita + 50 de lei reducere</h2>
                    <h3 className="text-center font-bold text-gray-700 md:max-w-[50%] sm:max-w-[75%]">ULTIMA SANSA pentru oferta de iarna, inregistreaza-te pana pe 25/12 si primeste 50 de lei reducere la prima comanda. In plus, alege dintr-un borcan de miere, o sticla de sirop sau fursecuri in prima cutie.</h3>
                </div>
                <form action="/chooseOffer" className="flex flex-col items-center justify-center gap-4 mt-12" method="post">
                    <div className="flex flex-wrap gap-4">
                        <Option header="Miere" text="este buna" image="leaf2_00000.png"></Option>
                        <Option header="Miere" text="este buna" image="leaf2_00000.png"></Option>
                        <Option header="Miere" text="este buna" image="leaf2_00000.png"></Option>
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-4">

                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-[0.5*vdw] h-25 border px-3 py-1 transition-colors duration-150 ${email ? 'border-farm-green' : 'border-gray-300'} focus:border-farm-green focus:ring-2 focus:ring-farm-green/30 focus:outline-none"
                            />

                            <button
                                onClick={() => {
                                    //   setIsLogin(!isLogin);
                                    //   setError(null);
                                    //   // keep notice if we came for checkout, clear only sign-up temp notices
                                    //   if (!location.state?.notice) setNotice(null);
                                    //   setCanResend(false);
                                }}
                                className="btn btn-primary"
                            >
                                ADAUGA OFERTA IN COS
                            </button>
                        </div>
                    </div>
                </form >
            </div >
        </>
    );
}
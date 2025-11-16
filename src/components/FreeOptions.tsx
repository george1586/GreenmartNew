import React from "react";

type OptionProps = {
    header: string;
    text: string;
    image: string;
    alt?: string;
};

export function Option({ header, text, image, alt = header }: OptionProps) {
    return (
        <article className="card flex flex-col gap-4 mx-auto w-80">
            <img src={image} alt={alt} className="w-full md:h-48 md:w-48 object-cover rounded-lg flex-shrink-0 self-center" />
            <div>
                <div className="flex flex-col bg-red-500">
                    <div className="flex items-center">
                        <h4 className="text-lg font-semibold text-farm-dark">{header}</h4>
                        {/* keep native radio appearance but use accent-color to make it green when checked */}
                        <input
                            type="radio"
                            name="offer"
                            value={header}
                            className="ml-auto w-4 h-4 accent-farm-green"
                        />
                    </div>
                    <p className="text-gray-700 mt-2 text-sm">{text}</p>
                </div>
            </div>
        </article>
    );
}


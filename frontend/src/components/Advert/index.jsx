import Image from "next/image";
import React from "react";

function Advert({ id, pet }) {
    //? GELEN PET BİLGİSİNDEN USER_İD İLE BİRLİKTE FETCHSİNGLEUSER ÇALIŞARAK OWNER BİLGİLERİNE ULAŞILACAK
    console.log(pet);
    return (
        <div key={id} className="flex flex-col rounded-md shadow-md h-full">
            <div className="border-b-2">
                <div className="relative w-full h-24 md:h-36 lg:h-48">
                    <Image
                        src={pet.images[0] || "/indir.webp"}
                        alt={pet.petName || "advert"}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-md"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 p-2 flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between items-center p-2 w-full">
                    <span className="text-sm font-bold truncate">{pet.petName || "Unknown Pet"}</span>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <div className="relative w-6 h-6">
                            <Image
                                src={pet.ownerAvatar || "/default-avatar.jpg"}
                                alt={pet.owner || "Owner"}
                                fill
                                className="rounded-full"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <span className="text-xs md:text-md lg:text-md truncate">{pet.owner || "Unknown Owner"}</span>
                    </div>
                </div>

                <div className="text-xs text-gray-700 p-2 h-24 overflow-hidden text-ellipsis">
                    {pet.description || "No description available."}
                </div>
            </div>
        </div>
    );
}

export default Advert;

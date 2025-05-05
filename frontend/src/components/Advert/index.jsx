"use client";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import React, { useEffect, useState } from "react";

function Advert({ pet }) {
    // console.log("pet", pet);
    const [owner, setOwner] = useState(null);
    const [loadingOwner, setLoadingOwner] = useState(true);
    const userId = pet?.user?._id;

    // useEffect(() => {
    //     const fetchOwner = () => {
    //         const own = Users?.data?.find((user) => user._id === userId);
    //         // console.log("own", own);
    //         setOwner(own || null);
    //         setLoadingOwner(false);
    //     };

    //     if (userId) {
    //         fetchOwner();
    //     }
    // }, [userId]);


    // useEffect(() => {
    //     if (owner) {
    //         console.log("Updated owner details:", owner);
    //     } else {
    //         console.log("Owner not found");
    //     }
    // }, [owner]);
    return (
        <Link
            href={{
                pathname: `/advert/${pet._id}`,
                query: { pet: slugify(pet.petName).toLowerCase() },
            }}
            key={pet._id}
            className="flex flex-col rounded-md shadow-md h-full">
            <div className="border-b-2">
                <div className="relative w-full h-24 md:h-36 lg:h-48">
                    <Image
                        src={pet.images[0] || "/indir.webp"}
                        alt={pet.petName || "advert"}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-md"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        priority
                    />

                </div>
            </div>
            <div className="flex flex-col gap-2 p-2 flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between items-center p-2 w-full">
                    <span className="text-sm font-bold truncate">{pet.petName || "Unknown Pet"}</span>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <div className="relative w-6 h-6">
                            <Image
                                src="/default-avatar.jpg"
                                alt={owner?.userName || "Owner"}
                                fill
                                className="rounded-full"
                                style={{ objectFit: "cover" }}
                                sizes="24px"
                            />

                        </div>
                        <span className="text-xs md:text-md lg:text-md truncate">{owner?.userName || "Unknown Owner"}</span>
                    </div>
                </div>

                <div className="text-xs text-gray-700 p-2 h-24 overflow-hidden text-ellipsis">
                    {pet.description || "No description available."}
                </div>
            </div>
        </Link>
    );
}

export default Advert;

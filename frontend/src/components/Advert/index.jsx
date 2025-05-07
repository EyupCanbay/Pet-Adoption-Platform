"use client";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import React, { useEffect, useState } from "react";
import { getSingleUser } from "@/src/services/User";

function Advert({ pet, userId }) {
    const [ownerImageError, setOwnerImageError] = useState(false);
    const [owner, setOwner] = useState(null);
    const [loadingOwner, setLoadingOwner] = useState(true);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await getSingleUser(userId);
                if (response.status === "Success") {
                    setOwner(response.data);
                } else {
                    console.error("No data received from the server.");
                }
            } catch (error) {
                console.error("Error fetching owner details:", error);
            } finally {
                setLoadingOwner(false);
            }
        };
        fetchOwner();
    }, [pet, userId]);

    return (
        <Link
            href={{
                pathname: `/advert/${pet._id}`,
                query: { pet: slugify(pet.petName).toLowerCase() },
            }}
            key={pet._id}
            className="relative flex flex-col rounded-md shadow-md h-full hover:shadow-lg transition-shadow duration-200"
        >
            {pet.type === "lost" && (
                <div className="absolute top-2 right-[-30px] rotate-45 bg-red-600 text-white text-[10px] font-bold px-6 py-1 shadow-md z-10">
                    Kayıp Hayvan
                </div>
            )}


            {/* Resim Alanı */}
            <div className="border-b-2">
                <div className="relative w-full h-24 md:h-36 lg:h-48">
                    <Image
                        src={pet.images?.[0] || "/indir.webp"}
                        alt={pet.petName || "advert"}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-md"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        priority
                    />
                </div>
            </div>

            {/* Bilgi Alanı */}
            <div className="flex flex-col gap-2 p-2 flex-grow">
                {/* Başlık ve Sahip */}
                <div className="flex flex-col md:flex-row md:justify-between items-center p-2 w-full">
                    <span className="text-sm font-bold truncate">{pet.petName || "Bilinmeyen Hayvan"}</span>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <div className="relative w-6 h-6">
                            <Image
                                src={
                                    !ownerImageError && owner?.profilePhoto
                                        ? owner.profilePhoto
                                        : "/default-avatar.jpg"
                                }
                                alt={owner?.userName || "Sahip"}
                                fill
                                className="rounded-full"
                                style={{ objectFit: "cover" }}
                                sizes="24px"
                                onError={() => setOwnerImageError(true)}
                            />
                        </div>
                        <span className="text-xs md:text-md truncate">
                            {owner?.userName || "Bilinmeyen Sahip"}
                        </span>
                    </div>
                </div>

                {/* Açıklama */}
                <div className="text-xs text-gray-700 p-2 h-24 overflow-hidden text-ellipsis">
                    {pet.description || "Açıklama mevcut değil."}
                </div>
            </div>
        </Link>
    );
}

export default Advert;

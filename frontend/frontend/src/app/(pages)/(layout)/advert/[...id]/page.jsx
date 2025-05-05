"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import slugify from "slugify";
import Link from "next/link";
import Loading from "@/src/components/Loading";
import { fetchSingleListing } from "@/src/services/Listings";

function AdvertDetails() {
    const params = useParams();
    const { id } = params;
    const [pet, setPet] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await fetchSingleListing(id);
                // console.log('response :>> ', response);
                if (response) {
                    //TODO EĞER RESPONSE DATA ARRAY DÖNERSE İLK İNDEXİNİ AL OBJECT DÖNERSE KENDİSİNİ AL
                    setPet(response.data[0] || response.data);
                    setUser(response.user);
                } else {
                    console.error("No data received from the server.");
                }
            } catch (error) {
                console.error("Error fetching pet details:", error);
            }
        };
        fetchPetDetails();
    }, [id])

    // useEffect(() => {
    //     if (pet) {
    //         console.log("Pet details:", pet);
    //     }
    //     if (user) {
    //         console.log("User details:", user);
    //     }
    // }, [pet, user]);

    if (!pet) {
        return <Loading />;
    }

    const {
        petName,
        description,
        age,
        gender,
        images,
        category_name,
        sub_category_name,
        owner,
        additionalInfo,
    } = pet;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow">
                        <img
                            src={"/default-avatar.jpg" || images?.[activeImage]}
                            alt="Pet image"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex gap-3 mt-4 overflow-x-auto">
                        {images?.map((img, index) => (
                            <img
                                key={index}
                                onClick={() => setActiveImage(index)}
                                src={"/default-avatar.jpg" || img}
                                className={`h-20 w-32 object-cover rounded-lg cursor-pointer border-2 ${activeImage === index ? "border-blue-500" : "border-transparent"}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-3 bg-white rounded-xl p-6 shadow">
                    <h2 className="text-2xl font-semibold">{petName}</h2>
                    <p className="text-gray-600 text-sm">
                        {category_name} / {sub_category_name}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                        <p><span className="font-medium">Yaş:</span> {age}</p>
                        <p><span className="font-medium">Cinsiyet:</span> {gender ? "Dişi" : "Erkek"}</p>
                        <p><span className="font-medium">Renk:</span> {additionalInfo.color}</p>
                        <p><span className="font-medium">Göz Rengi:</span> {additionalInfo.eyeColor}</p>
                        <p><span className="font-medium">Ağırlık:</span> {additionalInfo.weight} kg</p>
                        <p><span className="font-medium">Ebat:</span> {additionalInfo.size}</p>
                        <p><span className="font-medium">Tüy Tipi:</span> {additionalInfo.furType}</p>
                        <p><span className="font-medium">Aşı:</span> {additionalInfo.vaccinated ? "Evet" : "Hayır"}</p>
                        <p><span className="font-medium">Kısır:</span> {additionalInfo.neutered ? "Evet" : "Hayır"}</p>
                        <p><span className="font-medium">Arkadaş Canlısı:</span> {additionalInfo.sociality}</p>
                    </div>
                    {user && (
                        <Link href={`/profile/${user.userName}`} className="flex justify-start gap-4 items-center mt-4">
                            <p className="text-sm text-gray-400 mt-2">Sahibi: {user.userName}</p>
                            <img
                                src={user.profilePhoto || "/default-avatar.jpg"}
                                alt="Owner"
                                className="w-8 h-8 rounded-full mt-2"
                            />
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-semibold mb-2">İlan Açıklaması</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default AdvertDetails;

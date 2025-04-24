"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PetListing from "@/mocks/pet_listings.json";
import slugify from "slugify";
import Users from "@/mocks/users.json";
import Link from "next/link";
import Loading from "@/src/components/Loading";

function AdvertDetails() {
    const params = useParams();
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
    const [pet, setPet] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchPetDetails = () => {
            const match = PetListing?.data?.find((pet) => {
                const generatedSlug = slugify(pet?.petName || "", { lower: true });
                return generatedSlug === slug;
            });
            setPet(match || null);
            if (match) {
                const ownerId = match?.user_id;
                const owner = Users?.data?.find((user) => user._id === ownerId);
                setUser(owner || null);
            }
        };
        if (slug) fetchPetDetails();
    }, [slug]);
    if (!pet) {
        return <Loading />
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
        additionalInfo
    } = pet;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
            {/* Görsel ve Slider */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Aktif Resim */}
                <div className="flex-1">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow">
                        <img
                            src={"/default-avatar.jpg" || images?.[activeImage]}
                            alt="Pet image"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Thumbnail Slider */}
                    <div className="flex gap-3 mt-4 overflow-x-auto">
                        {images?.map((img, index) => (
                            <img
                                key={index}
                                onClick={() => setActiveImage(index)}
                                src={"/default-avatar.jpg" || img}
                                className={`h-20 w-32 object-cover rounded-lg cursor-pointer border-2 ${activeImage === index ? "border-blue-500" : "border-transparent"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Bilgiler */}
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
                    <Link
                        href={`/profile/${user._id}`}
                        className="flex justify-start gap-4 items-center mt-4">
                        <p className="text-sm text-gray-400 mt-2">Sahibi: {user.userName}</p>
                        <img
                            src={user.profilePhoto || "/default-avatar.jpg"}
                            alt="Owner"
                            className="w-8 h-8rounded-full mt-2"
                        />
                    </Link>
                </div>
            </div>

            {/* Açıklama */}
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

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import slugify from "slugify";
import Link from "next/link";
import Loading from "@/src/components/Loading";
import { fetchSingleListing } from "@/src/services/Listings";
import { useUser } from "@/src/context/userProvider";
import ReportUser from "@/src/components/reportUserSection";
import { fetchSingleLostListing, getAllLostListings } from "@/src/services/LostListings";

function AdvertDetails() {
    const { user } = useUser();
    const params = useParams();
    const { id } = params;
    const [pet, setPet] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [ownerImageError, setOwnerImageError] = useState(false);
    const [petImageError, setPetImageError] = useState(false);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                let response = await fetchSingleListing(id);
                // console.log("Listing response:", response);
                if (response?.data) {
                    const data = Array.isArray(response.data) ? response.data[0] : response.data;
                    if (data) {
                        setPet(data);
                        setCurrentUser(data.user);
                        return;
                    }
                }
                let lost = await fetchSingleLostListing(id);
                if (lost?.data) {
                    setPet(lost?.data[0] || lost?.data);
                    setCurrentUser(lost?.data[0].user || lost?.data.user);
                    return;
                }
            } catch (error) {
                console.error("İlan detayları alınırken hata oluştu:", error);
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
        address,
    } = pet;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow">
                        <img
                            src={images?.[activeImage]}
                            alt={petName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex gap-3 mt-4 overflow-x-auto">
                        {images?.map((img, index) => (
                            <img
                                key={index}
                                onClick={() => setActiveImage(index)}
                                src={img}
                                alt={petName}
                                className={`h-20 w-32 object-cover rounded-lg cursor-pointer border-2 ${activeImage === index ? "border-blue-500" : "border-transparent"}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-3 bg-white rounded-xl p-6 shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">{petName}</h2>
                        {currentUser?._id !== user?._id && (
                            <ReportUser currentUser={user} report={currentUser} id={id} />
                        )}
                    </div>
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

                    <div className="mt-6 text-sm">
                        <p>
                            <span className="font-semibold">Konum: </span>{address?.city},{address?.country}
                        </p>
                    </div>

                    {currentUser && (
                        <Link href={{
                            pathname: `/profile/${currentUser._id}/${slugify(currentUser.userName).toLowerCase()}`,
                        }} className="flex justify-start gap-4 items-center mt-4">
                            <p className="text-sm text-gray-400 mt-2">Sahibi: {currentUser.userName}</p>
                            <img
                                src={
                                    !ownerImageError && currentUser?.profilePhoto
                                        ? currentUser?.profilePhoto
                                        : "/default-avatar.jpg"
                                }
                                alt={currentUser?.userName || "Owner"}
                                className="w-8 h-8 rounded-full mt-2"
                                onError={() => setOwnerImageError(true)}
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

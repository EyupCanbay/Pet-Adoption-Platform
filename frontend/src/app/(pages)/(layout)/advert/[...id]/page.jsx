"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSingleListing } from "@/src/services/Listings";
import { useUser } from "@/src/context/userProvider";
import { fetchSingleLostListing } from "@/src/services/LostListings";
import { getSingleUser } from "@/src/services/User";
import Loading from "@/src/components/Loading";
import { FiUser, FiMapPin, FiInfo, FiHeart, FiShield, FiSmile } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { Button, Card, Typography } from "@material-tailwind/react";
import { fetchPetCommentsWithReplies } from "@/src/utils/commentsLoader";
import Comments from "../Comments";

const TABLE_HEAD = ["Özellik", "Değer"];

function AdvertDetails() {
    const { user } = useUser();
    const params = useParams();
    const { id } = params;
    const [pet, setPet] = useState(null);
    const [petOwner, setPetOwner] = useState(null);
    const [petLocation, setPetLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorImage, setErrorImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [ownerImageError, setOwnerImageError] = useState(false);
    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                let response = await fetchSingleListing(id);
                if (response?.data) {
                    const data = Array.isArray(response.data) ? response.data[0] : response.data;
                    if (data) {
                        setPet(data);
                        setSelectedImage(data?.images?.[0]);
                        const owner = await getSingleUser(data.user_id);
                        if (owner) {
                            setPetOwner(owner?.data?.user);
                            setPetLocation(owner?.data?.location[0]);
                            setLoading(false);
                        }
                    }
                }

                let result = await fetchSingleLostListing(id);
                if (result?.data) {
                    const data = Array.isArray(result.data) ? result.data[0] : result.data;
                    if (data) {
                        setPet(data);
                        setSelectedImage(data?.images?.[0]);
                        const owner = await getSingleUser(data.user_id);
                        if (owner) {
                            setPetOwner(owner?.data?.user);
                            setPetLocation(owner?.data?.location[0]);
                            setLoading(false);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching pet details:", error);
            }
        };
        fetchPetDetails();
    }, [id]);

    useEffect(() => {
        if (pet?._id) {
            fetchPetCommentsWithReplies(pet._id).then(setComments);
        }
    }, [pet]);

    if (loading) return <Loading />;

    const formattedPhoneNumber = petOwner?.phoneNumber
        ? `9${petOwner.phoneNumber.replace(/\D/g, '')}`
        : '';


    const sizeMap = {
        small: "Küçük",
        medium: "Orta",
        large: "Büyük",
    };

    const trainabilityMap = {
        easy: "Kolay",
        medium: "Orta",
        hard: "Zor",
    };

    const socialityMap = {
        low: "Düşük",
        medium: "Orta",
        high: "Yüksek",
    };

    const rows = [
        { label: "Yaş", value: pet.age },
        { label: "Cinsiyet", value: pet.gender ? "Erkek" : "Dişi" },
        { label: "Ağırlık", value: pet?.additionalInfo?.weight + " kg" },
        { label: "Boyut", value: sizeMap[pet?.additionalInfo?.size] || "Bilinmiyor" },
        { label: "Tüy Yapısı", value: pet?.additionalInfo?.furType },
        { label: "Renk", value: pet?.additionalInfo?.color },
        { label: "Göz Rengi", value: pet?.additionalInfo?.eyeColor },
        { label: "Oyunculuk", value: pet?.additionalInfo?.playfulness + " / 5" },
        {
            label: "Sosyallik",
            value: socialityMap[pet?.additionalInfo?.sociality] || "Bilinmiyor",
        },
        {
            label: "Eğitilebilirlik",
            value: trainabilityMap[pet?.additionalInfo?.trainability] || "Bilinmiyor",
        },
        {
            label: "Aşı Durumu",
            value: pet?.additionalInfo?.vaccinated ? "Aşılı" : "Aşısız",
        },
    ];


    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Image Gallery - Left */}
                <div className="lg:col-span-5 flex flex-col items-center">
                    <img
                        src={selectedImage || "/images/default-pet.jpg"}
                        alt={pet?.petName}
                        className="w-full h-96 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex flex-wrap w-full gap-3 mt-4">
                        {pet?.images?.map((image, idx) => (
                            <img
                                key={idx}
                                src={image}
                                className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                </div>

                <Card className="w-full lg:col-span-4">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-norma leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => {
                                return (
                                    <tr
                                        key={index}
                                    >
                                        <td className="px-4 py-2 border-r border-gray-200">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {row.label}
                                            </Typography>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Typography variant="small" className="font-normal">
                                                {row.value || "—"}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </Card>

                {/* Pet Owner Info - Right */}
                <div className="lg:col-span-3 bg-white flex flex-col items-center text-center bg-gray-100 pt-10 px-4 pb-6">
                    <img
                        src={
                            !ownerImageError && petOwner?.profilePhoto
                                ? petOwner?.profilePhoto
                                : "/ahmet.jpg"
                        }
                        onError={() => setErrorImage(true)}
                        alt={petOwner?.name}
                        className="w-16 h-16 object-cover rounded-md "
                    />
                    <div className="mt-4 space-y-2 text-sm w-full">
                        <div className="space-y-1">
                            <Link
                                href={`/profile/${petOwner?._id}`}
                                className="font-semibold text-gray-800 hover:text-gray-600 transition-colors"
                            >
                                {petOwner?.name} {petOwner?.surname}
                            </Link>
                            <p className="text-gray-500 text-xs">@{petOwner?.userName}</p>
                            <p className="text-xs text-gray-500">{petOwner?.job}</p>
                        </div>

                        <Button
                            variant="outlined"
                            color="green"
                            className="w-full flex items-center justify-center gap-2 text-xs cursor-pointer hover:bg-green-100 font-medium"
                            onClick={() => {
                                window.open(`https://api.whatsapp.com/send?phone=${formattedPhoneNumber}`, "_blank");
                            }
                            }
                            disabled={!formattedPhoneNumber}
                        >
                            <FaWhatsapp className="text-base" />
                            {(petOwner?.phoneNumber).replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4")}
                        </Button>
                        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-500 text-white text-xs shadow-sm">
                            <FiMapPin className="text-base" />
                            <span>{petLocation?.city}, {petLocation?.country}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-cyan-500 text-white text-xs shadow-sm">
                            İlan Oluşturma Tarihi: {new Date(pet?.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div>
                {comments.length > 0 && <Comments comment={comments} />}
            </div> */}
        </div>
    );
}

export default AdvertDetails;

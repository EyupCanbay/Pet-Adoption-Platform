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
import ReportUser from "@/src/components/reportUserSection";

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
    const [isLostAdvert, setIsLostAdvert] = useState(false); // New state to track advert type

    useEffect(() => {
        const fetchPetDetails = async () => {
            setLoading(true); // Ensure loading is true at the start of fetch
            try {
                let foundListing = null;
                let isLost = false;

                // Try fetching as a regular listing first
                const regularResponse = await fetchSingleListing(id);
                if (regularResponse?.data) {
                    const data = Array.isArray(regularResponse.data) ? regularResponse.data[0] : regularResponse.data;
                    if (data) {
                        foundListing = data;
                        isLost = false;
                    }
                }

                // If not found as regular, try as a lost listing
                if (!foundListing) {
                    const lostResponse = await fetchSingleLostListing(id);
                    if (lostResponse?.data) {
                        const data = Array.isArray(lostResponse.data) ? lostResponse.data[0] : lostResponse.data;
                        if (data) {
                            foundListing = data;
                            isLost = true;
                        }
                    }
                }

                if (foundListing) {
                    setPet(foundListing);
                    setSelectedImage(foundListing?.images?.[0]);
                    setIsLostAdvert(isLost); // Set the type of advert

                    const owner = await getSingleUser(foundListing.user_id);
                    if (owner?.data?.user) {
                        setPetOwner(owner.data.user);
                        setPetLocation(owner.data.location?.[0]); // Use optional chaining for location
                    } else {
                        console.warn("Pet owner not found or incomplete data.");
                        setPetOwner(null);
                        setPetLocation(null);
                    }
                } else {
                    console.warn("No listing found for this ID.");
                    setPet(null);
                    setPetOwner(null);
                    setPetLocation(null);
                }
            } catch (error) {
                console.error("Error fetching pet details:", error);
                setPet(null); // Clear pet on error
                setPetOwner(null);
                setPetLocation(null);
            } finally {
                setLoading(false); // Always set loading to false in finally block
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
    if (!pet) return <div className="text-center text-red-500 py-10">İlan bulunamadı veya bir hata oluştu.</div>; // Handle case where pet is null after loading

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

    // Ensure additionalInfo is an object to prevent errors if it's null/undefined
    const additionalInfo = pet.additionalInfo || {};

    const rows = [
        { label: "Yaş", value: pet.age },
        { label: "Cinsiyet", value: pet.gender ? "Erkek" : "Dişi" },
        { label: "Ağırlık", value: additionalInfo.weight ? `${additionalInfo.weight} kg` : "Bilinmiyor" },
        { label: "Boyut", value: sizeMap[additionalInfo.size] || "Bilinmiyor" },
        { label: "Tüy Yapısı", value: additionalInfo.furType || "Bilinmiyor" },
        { label: "Renk", value: additionalInfo.color || "Bilinmiyor" },
        { label: "Göz Rengi", value: additionalInfo.eyeColor || "Bilinmiyor" },
        { label: "Oyunculuk", value: additionalInfo.playfulness ? `${additionalInfo.playfulness} / 5` : "Bilinmiyor" },
        {
            label: "Sosyallik",
            value: socialityMap[additionalInfo.sociality] || "Bilinmiyor",
        },
        {
            label: "Eğitilebilirlik",
            value: trainabilityMap[additionalInfo.trainability] || "Bilinmiyor",
        },
        {
            label: "Aşı Durumu",
            value: additionalInfo.vaccinated ? "Aşılı" : "Aşısız",
        },
        // Add more rows for lost listing specific details if needed, e.g., lostDate, lostLocation
        {
            label: "Kayıp Tarihi",
            value: isLostAdvert && pet.lostDate ? new Date(pet.lostDate).toLocaleDateString("tr-TR") : "Uygulanamaz",
        },
        {
            label: "Kısırlaştırılmış",
            value: additionalInfo.neutered ? "Evet" : "Hayır",
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
                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/default-pet.jpg"; }} // Fallback for main image
                    />
                    <div className="flex flex-wrap w-full gap-3 mt-4">
                        {pet?.images?.map((image, idx) => (
                            <img
                                key={idx}
                                src={image}
                                className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setSelectedImage(image)}
                                onError={(e) => { e.target.onerror = null; e.target.src = "/images/default-pet.jpg"; }} // Fallback for thumbnails
                                alt={`Pet image ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Pet Details Table - Middle */}
                <Card className="w-full lg:col-span-4 p-4 shadow-md rounded-xl">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
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
                                        key={row.label || index} // Use label as key if unique, otherwise index
                                        className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""} // Zebra striping
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
                <div className="lg:col-span-3 bg-white flex flex-col items-center text-center bg-gray-100 pt-10 px-4 pb-6 rounded-xl shadow-md">
                    <img
                        src={
                            !ownerImageError && petOwner?.profilePhoto
                                ? petOwner?.profilePhoto
                                : "/ahmet.jpg" // Fallback image for owner
                        }
                        onError={() => setOwnerImageError(true)}
                        alt={petOwner?.name || "Pet Owner"}
                        className="w-24 h-24 object-cover rounded-full border-2 border-blue-500"
                    />
                    <div className="mt-4 space-y-2 text-sm w-full">
                        <div className="space-y-1">
                            <Link
                                href={`/profile/${petOwner?._id}`}
                                className="font-semibold text-gray-800 hover:text-gray-600 transition-colors text-lg"
                            >
                                {petOwner?.name} {petOwner?.surname}
                            </Link>
                            <p className="text-gray-500 text-xs">@{petOwner?.userName}</p>
                            <p className="text-xs text-gray-500">{petOwner?.job}</p>
                        </div>

                        {petOwner?.phoneNumber && ( // Only show button if phone number exists
                            <Button
                                variant="outlined"
                                color="green"
                                className="w-full flex items-center justify-center gap-2 text-xs cursor-pointer hover:bg-green-100 font-medium mt-4"
                                onClick={() => {
                                    window.open(`https://api.whatsapp.com/send?phone=${formattedPhoneNumber}`, "_blank");
                                }}
                                disabled={!formattedPhoneNumber}
                            >
                                <FaWhatsapp className="text-base" />
                                {petOwner?.phoneNumber.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4")}
                            </Button>
                        )}

                        {petLocation?.city && petLocation?.country && ( // Only show location if data exists
                            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-500 text-white text-xs shadow-sm mt-2">
                                <FiMapPin className="text-base" />
                                <span>{petLocation.city}, {petLocation.country}</span>
                            </div>
                        )}
                        {pet?.createdAt && ( // Only show creation date if it exists
                            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-cyan-500 text-white text-xs shadow-sm mt-2">
                                İlan Oluşturma Tarihi: {new Date(pet.createdAt).toLocaleDateString("tr-TR")}
                            </div>
                        )}

                        {/* Report Advert Button */}
                        {user && petOwner && pet && ( // Only show report button if user is logged in, owner and pet data is available
                            <div className="mt-4">
                                <ReportUser
                                    currentUser={user}
                                    reportedItem={pet}
                                    petOwner={petOwner}
                                    isLostListing={isLostAdvert}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                {comments.length > 0 && <Comments comment={comments} />}
            </div>
        </div>
    );
}

export default AdvertDetails;

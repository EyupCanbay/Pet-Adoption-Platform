"use client";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    IconButton,
    Avatar,
    Spinner,
} from "@material-tailwind/react";
import { useUser } from "@/src/context/userProvider";
import { deleteCurrentUserBookmarkById } from "@/src/services/User";
import { createLostListingsBookmarksbyPetId } from "@/src/services/LostListings";
import { useUserStore } from "@/src/store/useUserStore";
import { fetchSingleLostListing } from "@/src/services/LostListings";
import { CardPlacehoderSkeleton } from "./advertSkeleton";

function LostListingAdvert({ pet }) {
    const { user } = useUser();
    const setUser = useUserStore((state) => state.setUser);
    const [ownerImageError, setOwnerImageError] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingPhoto, setLoadingPhoto] = useState(true);
    const [loadingPet, setLoadingPet] = useState(true);
    const [singlePet, setSinglePet] = useState(null);
    const fetchPetDetails = async () => {
        try {
            const response = await fetchSingleLostListing(pet._id);
            if (response) {
                setSinglePet(response.data[0] || response.data);
                setLoadingPhoto(false);
                setLoading(false);
                setLoadingPet(false);
            }
            else {
                console.error("No data received from the server.");
            }
        } catch (error) {
            console.error("Error fetching pet details:", error);
        }
    };
    useEffect(() => {
        fetchPetDetails();
        if (user?.data?.user?.bookmarks?.includes(pet._id)) {
            setIsBookmarked(true);
        } else {
            setIsBookmarked(false);
        }
    }, [user, pet._id]);

    const handleBookmark = async (e, petId) => {
        e.stopPropagation();
        try {
            if (isBookmarked) {
                await deleteCurrentUserBookmarkById(petId);
                updateUserBookmarks(petId, false);
                setIsBookmarked(false);
            } else {
                await createLostListingsBookmarksbyPetId(petId);
                updateUserBookmarks(petId, true);
                setIsBookmarked(true);
            }
        } catch (err) {
            console.error("Bookmark işleminde hata:", err);
        }
    };

    const updateUserBookmarks = (petId, add) => {
        setUser((prevState) => {
            const currentBookmarks = prevState.data?.user?.bookmarks || [];
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    user: {
                        ...prevState.data.user,
                        bookmarks: add
                            ? [...currentBookmarks, petId]
                            : currentBookmarks.filter((id) => id !== petId),
                    },
                },
            };
        });
    };

    if (loadingPet) {
        return (
            <div className="flex flex-wrap gap-4">
                {[...Array(6)].map((_, index) => (
                    <CardPlacehoderSkeleton key={index} />
                ))}
            </div>
        );
    }
    return (
        <Card className="w-full max-w-[26rem] shadow-lg flex flex-col justify-between h-full min-h-[300px]">
            <CardHeader floated={false} color="blue-gray">
                {singlePet && (
                    <Link
                        href={{
                            pathname: `/advert/${pet._id}`,
                            query: { pet: slugify(singlePet.petName).toLowerCase() },
                        }}
                        key={pet._id}
                        className="relative flex flex-col h-full hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="absolute top-4 left-[-30px] rotate-315 bg-red-600 text-white text-[10px] font-bold px-6 py-1 shadow-md z-10">
                            Kayıp Hayvan
                        </div>
                        {!loadingPhoto && (
                            <Image
                                src={singlePet?.images?.[0] || "/default-pet.jpg"}
                                alt="advert"
                                width={100}
                                height={100}
                                className="h-48 w-full object-cover rounded-t-md"
                                priority
                            />
                        )}
                    </Link>
                )}
                <IconButton
                    size="sm"
                    variant="text"
                    className="!absolute top-0 right-4 rounded-full cursor-pointer"
                    onClick={(e) => handleBookmark(e, pet?._id)}
                >
                    {isBookmarked ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="red"
                            className="h-6 w-6"
                        >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="h-6 w-6"
                        >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    )}
                </IconButton>
            </CardHeader>

            <CardBody className="flex-grow">
                <div className="mb-3 flex items-center justify-between">
                    <Typography variant="h6" color="blue-gray" className="text-sm">
                        <span className="font-bold">{singlePet?.petName}</span>{" "}
                        <span className="text-gray-400 text-xs">{singlePet?.sub_category_name}</span>
                    </Typography>
                </div>
                <Typography color="gray" className="text-xs">
                    {pet?.description?.length > 50
                        ? `${pet.description.slice(0, 50)}...`
                        : pet.description}
                </Typography>
            </CardBody>

            <CardFooter className="mt-auto border-t border-gray-200 pt-4 px-4">
                <div className="flex items-center gap-3">
                    <Avatar
                        src={
                            ownerImageError ? "/ahmet.jpg" : pet?.user?.profilePhoto
                        }
                        onError={() => setOwnerImageError(true)}
                        alt={pet?.user?.userName || "User"}
                        className="w-10 h-10"
                    />
                    <div>
                        <Typography variant="h6" className="text-sm">
                            {pet?.user?.userName}
                        </Typography>
                        <Typography variant="small" color="gray" className="text-xs font-normal">
                            {pet?.user?.job || "Kullanıcı"}
                        </Typography>
                    </div>
                </div>
                <Typography className="text-xs text-gray-500 mt-2 ml-auto">
                    {new Date(pet.createdAt).toLocaleDateString("tr-TR")}
                </Typography>
            </CardFooter>
        </Card>
    );
}

export default LostListingAdvert;

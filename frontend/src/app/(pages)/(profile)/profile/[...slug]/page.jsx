"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Advert from "@/src/components/Advert";
import Loading from "@/src/components/Loading";
import UserInfo from "@/src/components/UserInfo";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getSingleUser } from "@/src/services/User";
import { fetchListingByUserId } from "@/src/services/User";
import { CardPlacehoderSkeleton } from "@/src/components/Advert/advertSkeleton";

function AnotherProfile() {
    const params = useParams();
    const id = params?.slug?.[0];
    const userName = params?.slug?.[1];

    const [user, setUser] = useState(null);
    const [adverts, setAdverts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState(1);
    const [imageError, setImageError] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getSingleUser(id);
                setUser(response);

                const listingsResponse = await fetchListingByUserId(id);
                if (listingsResponse.status) {
                    const petListings = listingsResponse.data[0].petlisting.map((listing) => ({
                        ...listing,
                        type: "normal",
                    }));

                    const lostPetListings = listingsResponse.data[0].lostpetlisting.map((listing) => ({
                        ...listing,
                        type: "lost",
                    }));

                    const combinedListings = [...petListings, ...lostPetListings];
                    setAdverts(combinedListings);
                } else {
                    console.error("İlanlar alınamadı:", listingsResponse.message);
                    setAdverts([]);
                }
            } catch (error) {
                console.error("Kullanıcı veya ilanlar alınırken hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);



    const advertsPerPage = 6;
    const totalPages = Math.ceil(adverts.length / advertsPerPage);
    const startIndex = (currentPage - 1) * advertsPerPage;
    const displayedAdverts = adverts.slice(startIndex, startIndex + advertsPerPage);

    const paginate = (newPage) => {
        setDirection(newPage > currentPage ? 1 : -1);
        setCurrentPage(newPage);
    };

    if (loading) return <Loading />;
    if (!user) return <p className="text-center text-gray-500 mt-10">Kullanıcı bulunamadı.</p>;

    return (
        <div className="flex flex-col sm:grid sm:grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 lg:gap-6 w-full p-4">
            <UserInfo currentUser={user?.data?.user} location={user?.data?.location[0]} />
            <div className="w-full md:col-span-2">
                <div className="rounded-md shadow-md w-full max-w-4xl mx-auto p-4">
                    <span className="flex justify-center pb-2 font-semibold text-2xl border-b-2 border-gray-200 text-gray-600">
                        {user.name} {user.surname} - İLANLAR
                    </span>
                    <div className="relative overflow-hidden p-4">
                        <AnimatePresence custom={direction} mode="popLayout">
                            <motion.div
                                key={currentPage}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                initial={{ x: direction * 100 + "%", opacity: 0 }}
                                animate={{ x: "0%", opacity: 1 }}
                                exit={{ x: -direction * 100 + "%", opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {displayedAdverts.map((advert) => (
                                    <Suspense key={advert._id} fallback={<CardPlacehoderSkeleton />}>
                                        <Advert key={advert._id} pet={advert} userId={id} />
                                    </Suspense>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-4 items-center mt-4">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center px-4 py-2 rounded-full ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer"}`}
                        >
                            <FaArrowLeft />
                        </button>
                        <span className="text-lg">
                            Sayfa {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center px-4 py-2 rounded-full ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer"}`}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AnotherProfile;

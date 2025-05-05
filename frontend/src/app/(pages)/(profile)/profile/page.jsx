"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Advert from "@/src/components/Advert";
import Loading from "@/src/components/Loading";
import UserInfo from "@/src/components/UserInfo";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import PetListing from "@/mocks/pet_listings";
import slugify from "slugify";
import { useUser } from "@/src/context/userProvider";
function ProfilePage() {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [adverts, setAdverts] = useState([]);
    useEffect(() => {
        const fetchAdverts = async () => {
            //! ENDPOİNT YAZILMADI USERS/ME/LİSTİNGS YAZILINCA ORDAN ÇEK 
            //    setAdverts()
        };
        fetchAdverts();
    }, []);
    const filteredPets = adverts.slice(0, 12);

    const advertsPerPage = 6;
    const totalPages = Math.ceil(filteredPets.length / advertsPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState(1);

    setTimeout(() => setLoading(false), 1000);

    if (loading) return <Loading />;

    const paginate = (newPage) => {
        if (newPage > currentPage) {
            setDirection(1);
        } else {
            setDirection(-1);
        }
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * advertsPerPage;
    const displayedAdverts = filteredPets.slice(startIndex, startIndex + advertsPerPage);

    return (
        <div className="flex flex-col sm:grid sm:grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 lg:gap-6 w-full p-4">
            <UserInfo currentUser={user} />
            <div className="w-full md:col-span-2">
                <div className="rounded-md shadow-md w-full max-w-4xl mx-auto p-4">
                    <span className="flex justify-center pb-2 font-semibold text-2xl border-b-2 border-gray-200 text-gray-600">
                        İLANLAR
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
                                {
                                    displayedAdverts.length > 0 ?
                                        displayedAdverts.map((advert) => (

                                            <Link
                                                key={advert.user_id}
                                                href={{
                                                    pathname: `/advert/${slugify(advert.petName).toLowerCase()}`,
                                                    query: { pet: slugify(advert.petName).toLowerCase() },
                                                }}
                                            >
                                                <Advert key={advert.id} pet={advert} />
                                            </Link>
                                        ))
                                        :
                                        <div className="flex flex-col items-center justify-center h-full w-full">
                                            <span className="text-gray-500 text-lg">Henüz ilanınız yok.</span>
                                        </div>
                                }
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {
                        displayedAdverts.length > 0 && (
                            <div className="flex justify-center gap-4 items-center mt-4">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-4 py-2 rounded-full  ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer"
                                        }`}
                                >
                                    <FaArrowLeft />
                                </button>
                                <span className="text-lg">
                                    Sayfa {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-4 py-2 rounded-full  ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer"
                                        }`}
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;

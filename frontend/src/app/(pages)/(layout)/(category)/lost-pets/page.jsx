"use client";
import React, { useEffect, useState } from 'react'
import { getAllLostListings } from '@/src/services/LostListings'
import Advert from '@/src/components/Advert';
import Loading from '@/src/components/Loading';
import LostListingAdvert from '@/src/components/Advert/lost-listing';

function LostAdverts() {
    const [lostListings, setLostListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLostListings = async () => {
            try {
                const data = await getAllLostListings();
                if (!data) {
                    throw new Error("No data received");
                }
                setLostListings(data?.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching lost listings:", error);
            }
        }
        fetchLostListings();
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className='p-4 mx-auto max-w-7xl'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {lostListings.map((listing) => (
                            <LostListingAdvert pet={listing} key={listing?._id} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default LostAdverts
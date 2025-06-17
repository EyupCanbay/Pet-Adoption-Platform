import React from 'react'
import { getAllLostListings } from '@/src/services/LostListings'
import Loading from '@/src/components/Loading';
import LostListingAdvert from '@/src/components/Advert/lost-listing';

async function LostAdverts() {
    const response = await getAllLostListings();
    if (!response || !response.data || response.data.length === 0) {
        return <Loading />;
    }
    const lostListings = response?.data || [];
    return (
        <>
            <div className='p-4 mx-auto max-w-7xl'>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {lostListings.map((listing) => (
                        <LostListingAdvert pet={listing} key={listing?._id} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default LostAdverts
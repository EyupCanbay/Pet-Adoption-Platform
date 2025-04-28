"use client";

import React, { useEffect, useState } from 'react';
import Steps from './steps';
import PetListing from '@/mocks/pet_listings.json';
import Advert from '../Advert';
import Loading from '@/src/components/Loading'; // Loading componentini import ettik

function HomeComponent() {
    const [adverts, setAdverts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading durumu ekledik

    useEffect(() => {
        const fetchAdverts = () => {
            // Simulate fetching adverts from an API or data source
            setAdverts(PetListing?.data || []);
            setLoading(false); // Veriler geldikten sonra loading false
        };

        fetchAdverts();
    }, []);

    useEffect(() => {
        console.log("Adverts fetched:", adverts);
    }, [adverts]);

    if (loading) {
        return <Loading />; // Yükleniyorsa Loading göster
    }

    return (
        <div className="flex flex-col h-full py-4 px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {adverts.map((advert) => (
                    <Advert key={Math.random()} pet={advert} />
                ))}
            </div>
            <div className="mt-10">
                <Steps />
            </div>
        </div>
    );
}

export default HomeComponent;

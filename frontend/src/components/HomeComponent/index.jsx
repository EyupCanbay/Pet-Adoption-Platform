"use client";

import React, { useEffect, useState } from 'react';
import Steps from './steps';
import Advert from '../Advert';
import Loading from '@/src/components/Loading'; // Loading componentini import ettik
import { getAllListings } from '@/src/services/Listings';

function HomeComponent() {
    const [adverts, setAdverts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading durumu ekledik

    useEffect(() => {
        const fetchAdverts = async () => {
            try {
                const response = await getAllListings();
                if (response) {
                    setAdverts(response.data);
                    setLoading(false); // Yükleme tamamlandığında loading'i false yapıyoruzbb
                } else {
                    console.error("No data received from the server.");
                }
            } catch (error) {
                console.error("Error fetching adverts:", error);
            }
        };
        fetchAdverts();
    }, []);

    if (loading) {
        return <Loading />; // Yükleniyorsa Loading göster
    }

    return (
        <div className="flex flex-col h-full py-4 px-10">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {adverts.map((advert) => (
                    <Advert userId={advert?.user_id} key={Math.random()} pet={advert} />
                ))}
            </div>
            <div className="mt-10">
                <Steps />
            </div>
        </div>
    );
}

export default HomeComponent;

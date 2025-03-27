"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HomeComponent from "../components/HomeComponent";
import Loading from "../components/Loading";

function HomePageContainer() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="transition-all duration-300 ease-in-out flex-1">
                <HomeComponent />
            </div>
        </div>
    );
}

export default HomePageContainer;

"use client"
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import HomeComponent from "../components/HomeComponent";

function HomePageContainer() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Content area */}
            <div
                className="transition-all duration-300 ease-in-out flex-1" // Adjust margin left based on sidebar state
            >
                <HomeComponent />
            </div>
        </div>
    );
}

export default HomePageContainer;

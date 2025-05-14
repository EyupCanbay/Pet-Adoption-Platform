import React from "react";
import HomeComponent from "../components/HomeComponent";
import { Sidebar } from "../components/Sidebar";

function HomePageContainer() {

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

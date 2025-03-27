"use client";
import React, { useState } from "react";
import { BsBoxArrowInLeft } from "react-icons/bs"; // For the close button
import { RxHamburgerMenu } from "react-icons/rx";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false); // Sidebar state: open or closed

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Toggle the sidebar state
    };

    return (
        <div
            className={`${isOpen ? "absolute sm:z-50 top-0 left-0 md:relative lg:relative w-full sm:w-full bg-gray-100 md:w-64 lg:w-64" : "w-12 z-50 absolute md:relative lg:relative top-4 md:top-0 md:left-0 opacity-80 lg:w-16 md:w-16 bg-inherit"}
                md:transition-all md:duration-300 md:ease-in-out text-black h-max  overflow-hidden`}
        >
            <div className={`flex items-center px-4 pt-2 ${isOpen ? "justify-end" : "justify-center"}`}>
                <button
                    onClick={toggleSidebar}
                    className="cursor-pointer p-2"
                >
                    {isOpen ? (
                        <BsBoxArrowInLeft size={24} />
                    ) : (
                        <RxHamburgerMenu className="text-center " size={24} />
                    )}
                </button>
            </div>
            {isOpen && (
                <div className="px-4 py-6">
                    <ul className="space-y-4">
                        <li>Menu Item 1</li>
                        <li>Menu Item 2</li>
                        <li>Menu Item 3</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Sidebar;

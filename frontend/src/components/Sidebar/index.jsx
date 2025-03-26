"use client";
import React, { useState } from "react";
import { BsBoxArrowInLeft } from "react-icons/bs"; // For the close button
import { RxHamburgerMenu } from "react-icons/rx";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true); // Sidebar state: open or closed

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Toggle the sidebar state
    };

    return (
        <div>
            {/* Sidebar */}
            <div
                className={`${isOpen ? "w-64" : "w-16" // Adjust width based on sidebar state
                    } transition-all duration-300 ease-in-out z-50 bg-gray-100 text-black h-full hidden md:block overflow-hidden`} // Sidebar transitions in and out from the left
            >
                <div className={`flex items-center px-4 pt-2 ${isOpen ? "justify-end" : "justify-center"}`}>
                    <button
                        onClick={toggleSidebar}
                        className="cursor-pointer p-2 rounded-full"
                    >
                        {isOpen ? (
                            <BsBoxArrowInLeft size={24} />
                        ) : (
                            <RxHamburgerMenu className="text-center" size={24} />
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
        </div>
    );
}

export default Sidebar;

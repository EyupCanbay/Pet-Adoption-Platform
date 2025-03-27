"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Users from "@/mocks/users";
import { IoMdArrowDropdown, IoMdNotificationsOutline } from 'react-icons/io';
import Link from 'next/link';

function ProfileSection() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const dropdownRef = useRef(null);
    const fetchNotifications = () => {
        const mockNotifications = [
            { id: 1, message: "New friend request", read: false },
            { id: 2, message: "Your post got a like", read: true },
            { id: 3, message: "New comment on your post", read: false },
        ];
        setNotifications(mockNotifications);
        setNotificationCount(mockNotifications.filter(notification => !notification.read).length);
    };

    useEffect(() => {
        //* setUser(Users[0]);
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="flex items-center gap-4 md:gap-6">
            {user === null ? (
                <div className="flex gap-4">
                    <button
                        className="md:px-6 md:py-2 px-3 py-2 text-sm md:text-md bg-blue-500 text-white cursor-pointer rounded-lg hover:bg-blue-600 focus:outline-none"
                        onClick={() => router.push('/login')}
                    >
                        Login
                    </button>
                    <button
                        className="md:px-6 md:py-2 px-3 py-2 text-sm md:text-md bg-green-500 text-white cursor-pointer rounded-lg hover:bg-green-600 focus:outline-none"
                        onClick={() => router.push('/register')}
                    >
                        Register
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Link
                            className="text-xl text-gray-600 hover:text-blue-500 focus:outline-none"
                            href="/notifications"
                        >
                            <IoMdNotificationsOutline
                                className="bg-orange-400 text-white rounded-full"
                                size={24}
                            />
                        </Link>
                        {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2">
                                {notificationCount}
                            </span>
                        )}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="text-lg font-semibold text-gray-800 cursor-pointer focus:outline-none flex items-center gap-1"
                        >
                            {user.userName}
                            <IoMdArrowDropdown className="text-lg" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                                <ul className="py-2">
                                    <li>
                                        <Link
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            href="/profile"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            href="/settings"
                                        >
                                            Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            href="/logout"
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileSection;

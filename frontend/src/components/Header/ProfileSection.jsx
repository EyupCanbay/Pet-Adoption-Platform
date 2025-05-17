"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/userProvider";
import { LogoutUser } from "@/src/services/Auth";
import Link from "next/link";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
    Avatar,
    Typography,
    ButtonGroup,
} from "@material-tailwind/react";
import {
    UserCircleIcon,
    Cog6ToothIcon,
    PowerIcon,
    InboxArrowDownIcon,
    LifebuoyIcon,
    ChevronDownIcon,
    BellIcon,
    PlusCircleIcon,
    ArrowRightOnRectangleIcon,
    UserPlusIcon,
} from "@heroicons/react/24/solid";

const profileMenuItems = [
    {
        label: "Profile",
        icon: UserCircleIcon,
        href: "/profile",
    },
    {
        label: "Settings",
        icon: Cog6ToothIcon,
        href: "/settings",
    },
];

function ProfileSection() {
    const router = useRouter();
    const { user } = useUser();
    const [notificationCount, setNotificationCount] = useState(0);
    const [ownerImageError, setOwnerImageError] = useState(false);
    const handleLogout = async () => {
        await LogoutUser();
        window.location.href = "/login";
    };

    if (!user) {
        return (
            <Menu placement="bottom-end">
                <MenuHandler>
                    <Button
                        variant="outlined"
                        color="blue-gray"
                        className="text-sm font-semibold px-4 py-2 cursor-pointer"
                    >
                        Giriş Yap
                    </Button>
                </MenuHandler>
                <MenuList className="p-2 shadow-lg border border-gray-200">
                    <Link href="/login">
                        <MenuItem
                            className="flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                        >
                            <ArrowRightOnRectangleIcon className="h-7 w-5 text-blue-gray-500" />
                            Giriş Yap
                        </MenuItem>
                    </Link>
                    <Link href="/register">
                        <MenuItem
                            className="flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                        >
                            <UserPlusIcon className="h-7 w-5 text-blue-gray-500" />
                            Kayıt Ol
                        </MenuItem>
                    </Link>
                </MenuList>
            </Menu>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="outlined"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-orange-300 cursor-pointer rounded-md hover:bg-orange-100"
                onClick={() => router.push("/create-advert")}
            >
                <PlusCircleIcon className="h-6 w-6 text-orange-300" />
                <span className="ml-2 text-sm">İlan Oluştur</span>
            </Button>

            <Link href="/notifications" className="relative">
                <BellIcon className="h-6 w-6 text-orange-400" />
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                        {notificationCount}
                    </span>
                )}
            </Link>

            <Menu placement="bottom-end">
                <MenuHandler>
                    <Button
                        variant="text"
                        className="flex items-center cursor-pointer gap-2 px-2 py-1 hover:bg-gray-100"
                    >
                        <Avatar
                            size="sm"
                            variant="circular"
                            src={
                                !ownerImageError
                                    ? "/ahmet.jpg"
                                    : user?.data?.user?.profilePhoto
                            }
                            onError={() => setOwnerImageError(true)}
                            alt="user-avatar"
                            className="w-12 h-12"
                            priority="true"
                        />
                        <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                    </Button>
                </MenuHandler>
                <MenuList className="p-2 rounded-lg shadow-md min-w-[180px]">
                    {
                        user?.data?.user?.role === "ADMIN" && (
                            <Link href="/admin">
                                <MenuItem className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 focus:bg-gray-100 transition-colors">

                                    <InboxArrowDownIcon className="h-5 w-5 text-gray-600" />
                                    <Typography variant="paragraph" className="text-base font-medium text-gray-800">
                                        Admin Paneli
                                    </Typography>
                                </MenuItem>
                            </Link>
                        )}
                    {profileMenuItems.map(({ label, icon: Icon, href }) => (
                        <Link key={label} href={href}>
                            <MenuItem className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 focus:bg-gray-100 transition-colors">
                                <Icon className="h-5 w-5 text-gray-600" />
                                <Typography variant="paragraph" className="text-base font-medium text-gray-800">
                                    {label}
                                </Typography>
                            </MenuItem>
                        </Link>
                    ))}
                    <MenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <PowerIcon className="h-5 w-5 text-red-500" />
                        <Typography variant="paragraph" className="text-base font-medium text-red-500">
                            Logout
                        </Typography>
                    </MenuItem>
                </MenuList>

            </Menu>
        </div>
    );
}

export default ProfileSection;

import { useUser } from '@/src/context/userProvider';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaEdit, FaStar, FaRegStar } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineEmail, MdPhone, MdWork, MdLocationOn } from "react-icons/md";
import { SiAuth0 } from "react-icons/si";
import BlockUser from '../blockUserSection';

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";

function UserInfo({ currentUser, location }) {
    const { user } = useUser();
    const [imageError, setImageError] = React.useState(false);

    const permissionColors = {
        Admin: "text-sm px-2 py-1 bg-red-200 text-red-700 rounded-md",
        User: "text-sm px-2 py-1 bg-blue-200 text-blue-700 rounded-md",
        SuperAdmin: "text-sm px-2 py-1 bg-green-200 text-green-700 rounded-md"
    };

    return (
        <div className="flex flex-col items-center py-6 px-4 w-full">
            <Card className="w-3/4 max-w-md shadow-none border border-gray-200 rounded-md">
                <CardHeader floated={false} className="h-80">
                    <img
                        src={imageError || !currentUser?.profilePicture ? "/default-avatar.jpg" : currentUser?.profilePicture}
                        onError={() => setImageError(true)}
                        alt="profile-picture"
                        className="w-full h-full object-cover"
                    />
                </CardHeader>
                <CardBody className="text-center">
                    <Typography variant="h5" className="mb-1 text-gray-800">
                        {currentUser.name} {currentUser.surname}
                    </Typography>
                    <Typography className="text-sm text-gray-500 mb-3">
                        {currentUser.job || "Meslek belirtilmedi"}
                    </Typography>

                    <div className="text-left text-sm text-gray-700 space-y-3">
                        <div className="flex items-center gap-2">
                            <LiaBirthdayCakeSolid className="text-pink-500" />
                            <span>
                                {currentUser.birthdate
                                    ? new Date(currentUser.birthdate).toLocaleDateString("tr-TR")
                                    : "Doğum tarihi belirtilmedi"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdOutlineEmail className="text-blue-500" />
                            <span>{currentUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdPhone className="text-green-500" />
                            <span>{currentUser.phoneNumber || "Telefon belirtilmedi"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdWork className="text-gray-500" />
                            <span>{currentUser.job || "Meslek belirtilmedi"}</span>
                        </div>

                        {/* Location Section */}
                        {location && (
                            <div className="flex items-start gap-2">
                                <MdLocationOn className="text-red-500 mt-0.5" />
                                <div className="space-y-0.5">
                                    <p><span className="font-medium">Mahalle:</span> {location.neighborhood}</p>
                                    <p><span className="font-medium">Şehir:</span> {location.city}</p>
                                    <p><span className="font-medium">Eyalet:</span> {location.state}</p>
                                    <p><span className="font-medium">Ülke:</span> {location.country}</p>
                                </div>
                            </div>
                        )}

                        {/* Role */}
                        <div className="flex items-center gap-2">
                            <SiAuth0 className="text-purple-500" />
                            <ul className="flex gap-2">
                                <li className={permissionColors[currentUser.role] || permissionColors.User}>
                                    {currentUser.role}
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex justify-between items-center px-4 pb-4">
                    {currentUser.bio && (
                        <span className="text-xs text-gray-600 italic">
                            "{currentUser.bio}"
                        </span>
                    )}
                    {currentUser?._id === user?.data?.user?._id ? (
                        <Link href="/settings">
                            <FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                        </Link>
                    ) : (
                        <BlockUser currentUser={user?.data?.user} block={currentUser} />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default UserInfo;

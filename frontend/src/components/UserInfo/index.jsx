import { useUser } from '@/src/context/userProvider';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineEmail, MdPhone, MdWork } from "react-icons/md";
import { SiAuth0 } from "react-icons/si";
import { FaStar, FaRegStar } from "react-icons/fa";
import BlockUser from '../blockUserSection';
import ReportUser from '../reportUserSection';

function UserInfo({ currentUser, count }) {
    const { user } = useUser();
    console.log(currentUser);

    const [imgSrc, setImgSrc] = React.useState(currentUser?.profilePicture || "/default-avatar.jpg");
    const permissionColors = {
        Admin: "text-md shadow-md font-semibold hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer rounded-md px-4 py-2 bg-red-200 text-red-700 border-red-300",
        User: "text-md shadow-md font-semibold hover:bg-blue-300 transition duration-300 ease-in-out cursor-pointer rounded-md px-4 py-2 bg-blue-200 text-blue-700 border-blue-300",
        SuperAdmin: "text-md shadow-md font-semibold hover:bg-green-300 transition duration-300 ease-in-out cursor-pointer rounded-md px-4 py-2 bg-green-200 text-green-700 border-green-300"
    };

    // Yıldızları render etmek için fonksiyon
    const renderStars = (rateValue) => {
        const stars = [];
        const normalized = Math.round(rateValue / 2); // 10 üzerinden gelen değeri 5 yıldız ölçeğine indir
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= normalized ? <FaStar key={i} className="text-yellow-500" /> : <FaRegStar key={i} className="text-gray-300" />);
        }
        return stars;
    };

    return (
        <div className="flex flex-col space-y-4 py-6 px-6 md:col-span-1">
            <div className="flex flex-col md:flex-col lg:flex-col xl:flex-row items-center rounded-md shadow-md p-4 space-y-4 md:space-y-2 lg:space-y-4 md:space-x-4 lg:space-x-8 xl:space-x-12 relative">
                <div className="flex flex-col items-center rounded-md p-2">
                    <Image
                        src={imgSrc}
                        alt={`${currentUser.userName} profil resmi`}
                        width={100}
                        height={100}
                        className="rounded-full"
                        style={{ objectFit: "cover", width: "auto", height: "auto" }}
                        onError={() => setImgSrc("/default-avatar.jpg")}
                        priority
                    />
                    <span className='font-semibold'>{currentUser.userName}</span>
                </div>
                <div className="flex flex-col space-y-2 text-center">
                    <span className="font-bold border-b-2 border-gray-200 text-lg">İlan Sayısı</span>
                    <span className="text-2xl font-semibold">
                        {count}
                    </span>
                </div>
                <div>
                    <Link
                        className="px-4 py-2 bg-indigo-600 text-white cursor-pointer rounded-lg hover:bg-indigo-800 focus:outline-none"
                        href="/create-advert"
                    >
                        <span className="mr-0.5">İlan</span>
                        <span>Oluştur</span>
                    </Link>
                </div>

                {currentUser.rates && currentUser.rates.length > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 px-4 pb-2 bg-white bg-opacity-75 rounded-lg shadow-md">
                        <div className="flex items-center">
                            {renderStars(currentUser.rates[0].rate)}
                        </div>
                        <span className="text-xs text-gray-500">({currentUser.rates[0].rate}/10)</span>
                    </div>
                )}
            </div>

            <div className='flex flex-col rounded-md shadow-md p-2'>
                <div className='flex justify-between items-center p-4 border-b-2 border-gray-200'>
                    <span>Kişisel Bilgiler</span>
                    {currentUser?._id === user?.data?.user?._id && (
                        <Link href="/settings">
                            <FaEdit className='text-gray-500 hover:text-gray-700 cursor-pointer' size={18} />
                        </Link>
                    )}
                    {currentUser?._id !== user?.data?.user?._id && (
                        <BlockUser currentUser={user?.data?.user} block={currentUser} />
                    )}

                </div>

                <span className='text-sm text-gray-700 p-4'>
                    {currentUser.bio || "Henüz bir biyografi yok."}
                </span>
                <div className='flex flex-col gap-3 p-4'>
                    <div className='flex justify-start items-center gap-1'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><LiaBirthdayCakeSolid /> Doğum günü:</span>
                        <span className='text-xs'>
                            {currentUser.birthdate
                                ? new Date(currentUser.birthdate).toLocaleDateString("tr-TR")
                                : "xx/xx/xxxx"}
                        </span>
                    </div>
                    <div className='flex justify-start items-center gap-1'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><MdOutlineEmail /> Email:</span>
                        <span className='text-xs'>{currentUser.email}</span>
                    </div>
                    <div className='flex justify-start items-center gap-1'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><MdPhone /> Telefon:</span>
                        <span className='text-xs'>{currentUser.phoneNumber}</span>
                    </div>
                    <div className='flex justify-start items-center gap-1'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><MdWork /> Meslek:</span>
                        <span className='text-xs'>{currentUser.job}</span>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><SiAuth0 /> Roller:</span>
                        <span className='text-xs'>
                            <ul className='flex justify-start gap-2'>
                                {currentUser.role === "ADMIN" ? <li className={permissionColors.Admin}>{currentUser.role}</li> : <li className={permissionColors.User}>{currentUser.role}</li>}
                            </ul>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo;

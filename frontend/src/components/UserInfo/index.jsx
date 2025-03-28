import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineEmail, MdPhone } from "react-icons/md";
import { SiAuth0 } from "react-icons/si";


function UserInfo({ currentUser }) {
    {/* CURRENT USER İLE PROFİLİNE GİRDİĞİN KULLANICI İÇİN İF ELSE KOYACAĞIM VE EĞERKİ DENKSE EDİT BUTONU O ZAMAN ÇIKACAK */ }
    const permissionColors = {
        Admin: "text-md shadow-md font-semibold hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer rounded-md px-4 py-2 bg-red-200 text-red-700 border-red-300",
        User: "text-md shadow-md font-semibold hover:bg-blue-300 transition duration-300 ease-in-out cursor-pointer rounded-md px-4 py-2 bg-blue-200 text-blue-700 border-blue-300",
        SuperAdmin: "text-md shadow-md font-semibold hover:bg-green-300 transition duration-300 ease-in-out cursor-pointer rounded-md px-4 py-2 bg-green-200 text-green-700 border-green-300"
    };
    return (
        <div className="flex flex-col space-y-4 py-6 px-6 md:col-span-1">
            <div className="flex flex-col md:flex-col lg:flex-col xl:flex-row  items-center rounded-md shadow-md p-4 space-y-4 md:space-y-2 lg:space-y-4 md:space-x-4 lg:space-x-8 xl:space-x-12">
                <div className="flex flex-col items-center rounded-md p-2">
                    <Image
                        src="/default-avatar.jpg"
                        alt="profile"
                        width={100}
                        height={100}
                        className="rounded-full"
                        style={{ objectFit: "cover" }}
                    />
                    <span>Username</span>
                </div>
                <div className="flex flex-col space-y-2 text-center">
                    <span className="font-bold border-b-2 border-gray-200 text-lg">İlan Sayısı</span>
                    <span className="font-semibold text-2xl text-gray-500">75</span>
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
            </div>
            <div className='flex flex-col rounded-md shadow-md p-2'>
                <div className='flex justify-between items-center p-4 border-b-2 border-gray-200'>
                    <span>Kişisel Bilgiler</span>
                    <Link
                        href="/settings"
                    >
                        {currentUser === true ? <div className='flex gap-2 items-center' ><FaEdit /> <span className='text-gray-600'>Edit</span></div> : null}
                    </Link>
                </div>
                <span className='text-sm text-gray-700 p-4'>
                    lorem ipsum lorem
                    ipsumlorem ipsumlorem lorem ipsum lorem
                    ipsumlorem ipsumloremlorem ipsum lorem
                    ipsumlorem ipsumlorem
                </span>
                <div className='flex flex-col gap-3 p-4'>
                    <div className='flex justify-start items-center gap-1'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><LiaBirthdayCakeSolid /> Doğum günü:</span>
                        <span className='text-xs'>08 February 2002</span>
                    </div>
                    <div className='flex justify-start items-center gap-1'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><MdOutlineEmail /> Email:</span>
                        <span className='text-xs'>amtyrgnc@gmail.com</span>
                    </div>
                    <div className='flex justify-start items-center gap-1'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><MdPhone /> Telefon:</span>
                        <span className='text-xs'>05416517357</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='font-semibold text-xs flex gap-1 items-center'><SiAuth0 /> Roller:</span>
                        <span className='text-xs'>
                            <ul className='flex  justify-start gap-2'>
                                <li className={permissionColors.SuperAdmin}>Süper Admin</li>
                                <li className={permissionColors.Admin}>Admin</li>
                                <li className={permissionColors.User}>User</li>
                            </ul>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo
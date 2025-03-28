"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

function Logo() {
    const router = useRouter();

    return (
        <button
            className='lg:text-3xl md:text-2xl text-lg cursor-pointer font-bold italic text-gray-300'
            onClick={() => router.push('/')}
        >
            PET ADOPTION
        </button>
    );
}

export default Logo;

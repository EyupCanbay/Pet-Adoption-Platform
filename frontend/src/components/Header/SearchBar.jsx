"use client";
import React from 'react';
import { IoMdSearch } from "react-icons/io";

function SearchBar() {
    return (
        <div className='md:hidden lg:flex hidden gap-2 items-center border border-gray-300 rounded-full justify-center'>
            <input
                type='text'
                placeholder='Search'
                className='sm:hidden md:block border border-gray-300 rounded-l-lg px-4 py-2 border-none outline-none w-96'
            />
            <button
                className='flex items-center justify-center cursor-pointer px-6 py-3 bg-gray-500 rounded-r-full'
                onClick={() => alert('Search')}
            >
                <IoMdSearch className='text-xl text-gray-100' />
            </button>
        </div>
    );
}

export default SearchBar;

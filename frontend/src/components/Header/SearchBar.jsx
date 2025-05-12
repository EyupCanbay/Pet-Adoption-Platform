"use client";
import React from 'react';

function SearchBar() {
    return (
        <div className="w-full max-w-sm min-w-[200px] bg-slate-100">
            <div className="relative">
                <input
                    className="w-full bg-transparent placeholder:text-slate-400 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-2 focus:border-slate-500 focus:shadow"
                    placeholder="Search..."
                    type="text"
                    aria-label="Search"
                />
                <button
                    className="absolute top-1 right-1 flex items-center py-1 px-1 border border-transparent cursor-pointer text-center text-sm text-white transition-all "
                    type="button"
                    aria-label="Search"
                    onClick={() => {
                        console.log('Search button clicked');
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default SearchBar;

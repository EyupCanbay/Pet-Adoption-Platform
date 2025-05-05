"use client"
import React from 'react';
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";


function Footer() {
    return (
        <footer>
            <div className='py-4 bg-gray-100'>
                <p className="text-gray-600 text-center text-sm md:text-md lg:text-md">
                    © 2025 Pet Adoption Platform. All rights reserved.
                </p>
                <div className="flex justify-center mt-4">
                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                        <FaInstagram className="text-3xl text-pink-400 mx-4 hover:text-pink-700 transition duration-300" />
                    </a>
                    <a href="https://www.github.com" target="_blank" rel="noreferrer">
                        <FaGithub className="text-3xl text-gray-500 mx-4 hover:text-black transition duration-300" />
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                        <FaLinkedin className="text-3xl text-blue-500 mx-4 hover:text-blue-700 transition duration-300" />
                    </a>
                </div>

            </div>
        </footer>
    );
}

export default Footer;

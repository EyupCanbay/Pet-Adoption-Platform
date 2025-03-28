"use client";
import React, { useEffect, useState } from "react";
import { BsBoxArrowInLeft } from "react-icons/bs"; // For the close button
import { RxHamburgerMenu } from "react-icons/rx";
import Categories from "@/mocks/categories.json";
import Link from "next/link";
import slugify from "slugify"; // Import slugify

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false); // Sidebar state: open or closed
    const [categories, setCategories] = useState([]); // State to hold categories

    useEffect(() => {
        try {
            // Fetch categories from the JSON file
            const fetchCategories = () => {
                setCategories(Categories?.data); // Set categories directly from the JSON file
            };
            fetchCategories();
        } catch (err) {
            console.log(err);
        }
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Toggle the sidebar state
    };

    return (
        <div
            className={`${isOpen ? "absolute sm:z-50 top-0 left-0 md:relative lg:relative w-full sm:w-full bg-gray-100 md:w-64 lg:w-64" : "w-12 z-50 absolute md:relative lg:relative top-4 md:top-0 md:left-0 opacity-80 lg:w-16 md:w-16 bg-inherit"}
                md:transition-all md:duration-300 md:ease-in-out text-black h-max overflow-hidden`}
        >
            <div className={` items-center px-4 pt-2 ${isOpen ? "justify-end absolute top-2 right-0 " : " flex justify-center"}`}>
                <button onClick={toggleSidebar} className="cursor-pointer p-2">
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
                        {categories.map((category) => (
                            <li key={category.id} className="text-lg font-medium">
                                <div className="border-b-2 border-gray-300 pb-2 mb-2 flex justify-start items-center gap-2">
                                    {/* Link to the category page with slugified name */}
                                    <Link href={`/${category.id}/${slugify(category.name, { lower: true })}`} passHref>
                                        {category.name}
                                    </Link>
                                    {/* Display count next to category name */}
                                    <span className="text-sm text-gray-500">
                                        ({category.count > 0 ? category.count : "1"})
                                    </span>
                                </div>
                                <ul className="space-y-3 ml-4">
                                    {category?.subCategory_id?.map((subCategory) => (
                                        <li key={subCategory.id} className="text-sm cursor-pointer hover:text-gray-900 hover:scale-102 text-gray-500">
                                            {/* Link to the subcategory page with slugified name */}
                                            <Link href={`/${category.id}/${slugify(subCategory.name, { lower: true })}`} passHref>
                                                {subCategory.name}
                                            </Link>
                                            {/* Display count next to subcategory name */}
                                            <span className="text-xs text-gray-400">
                                                ({subCategory.count > 0 ? subCategory.count : "1"})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Sidebar;

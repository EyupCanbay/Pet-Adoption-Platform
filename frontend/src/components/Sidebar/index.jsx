"use client";
import React, { useEffect, useState } from "react";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import Categories from "@/mocks/categories.json";
import Link from "next/link";
import slugify from "slugify";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");


    useEffect(() => {
        try {
            const fetchCategories = () => {
                setCategories(Categories?.data);
            };
            fetchCategories();
        } catch (err) {
            console.log(err);
        }
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    return (
        <div
            className={`${isOpen ? "absolute sm:z-50 top-0 left-0 md:relative lg:relative w-full sm:w-full bg-gray-100 md:w-64 lg:w-64" : "w-12 z-50 absolute md:relative lg:relative top-4 md:top-0 md:left-0 opacity-80 lg:w-16 md:w-16 bg-inherit"}
                md:transition-all md:duration-300 md:ease-in-out text-black h-max overflow-hidden`}
        >
            <div className={` items-center px-4 pt-2 ${isOpen ? "justify-end absolute top-2 right-0 " : " flex justify-center"}`}>
                <button
                    onClick={toggleSidebar}
                    className="cursor-pointer p-2"
                    aria-label="Toggle Sidebar"
                    title="Toggle Sidebar"
                >
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
                                    <Link
                                        href={{
                                            pathname: `/${category.id}/${slugify(category.name, { lower: true })}`,
                                            query: { name: slugify(category.name, { lower: true }) },
                                        }}
                                        passHref
                                        onClick={() => handleCategoryClick(slugify(category.name, { lower: true }))}
                                    >
                                        {category.name}
                                    </Link>
                                    <span className="text-sm text-gray-500">
                                        ({category.count > 0 ? category.count : "1"})
                                    </span>
                                </div>
                                <ul className="space-y-3 ml-4">
                                    {category?.subCategory_id?.map((subCategory) => (
                                        <li
                                            key={subCategory.id}
                                            className="text-sm cursor-pointer hover:text-gray-900 hover:scale-102 text-gray-500"
                                        >
                                            <Link
                                                href={{
                                                    pathname: `/${category.id}/${slugify(category.name, { lower: true })}`,
                                                    query: {
                                                        name: slugify(subCategory.name, { lower: true }),
                                                    },
                                                }}
                                                passHref
                                                onClick={() =>
                                                    handleCategoryClick(slugify(subCategory.name, { lower: true }))
                                                }
                                            >
                                                {subCategory.name}
                                            </Link>
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

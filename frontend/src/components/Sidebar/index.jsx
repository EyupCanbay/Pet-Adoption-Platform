"use client";
import React, { useEffect, useState } from "react";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { getAllCategories } from "@/src/services/Category";
import { getAllSubCategories } from "@/src/services/SubCategory";
import Link from "next/link";
import slugify from "slugify";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [groupedCategories, setGroupedCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, subCategoryRes] = await Promise.all([
                    getAllCategories(),
                    getAllSubCategories(),
                ]);

                const categories = categoryRes?.data || [];
                const subCategories = subCategoryRes?.data || [];

                // Aynı isimli subkategori gruplama
                const groupedSubMap = {};
                subCategories.forEach((sub) => {
                    const key = (sub.breed || sub.name || "").trim().toLowerCase();
                    if (!groupedSubMap[key]) {
                        groupedSubMap[key] = { ...sub, count: 1 };
                    } else {
                        groupedSubMap[key].count += 1;
                    }
                });

                const groupedSubCategories = Object.values(groupedSubMap);

                // Kategorilere göre grupla
                const grouped = categories.map((category) => {
                    const children = groupedSubCategories.filter(
                        (sub) => sub.category_id === category._id
                    );
                    return { ...category, subcategories: children };
                });

                setGroupedCategories(grouped);
            } catch (error) {
                console.error("Veriler alınırken hata oluştu:", error);
            }
        };

        fetchData();
    }, []);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div
            className={`${isOpen
                ? "absolute sm:z-50 top-0 left-0 md:relative lg:relative w-full sm:w-full bg-gray-100 md:w-64 lg:w-64"
                : "w-12 z-50 absolute md:relative lg:relative top-4 md:top-0 md:left-0 opacity-80 lg:w-16 md:w-16 bg-inherit"
                } md:transition-all md:duration-300 md:ease-in-out text-black h-max`}
        >
            <div
                className={` items-center px-4 pt-2 ${isOpen
                    ? "justify-end absolute top-2 right-0"
                    : " flex justify-center"
                    }`}
            >
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
                <div className="px-4 py-6 h-[calc(100vh-2rem)] overflow-y-auto">
                    <ul className="space-y-4">
                        {groupedCategories.map((category) => (
                            <li key={category._id} className="text-lg font-medium">
                                <div className="border-b-2 border-gray-300 pb-2 mb-2 flex justify-start items-center gap-2">
                                    <Link
                                        href={{
                                            pathname: `/${category._id}/${slugify(category.name, {
                                                lower: true,
                                            })}`,
                                            query: { name: slugify(category.name, { lower: true }) },
                                        }}
                                        passHref

                                    >
                                        {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                                    </Link>
                                    <span className="text-sm text-gray-500">
                                        ({category.subCategory_id.length > 0 ? category.subCategory_id.length : "1"})
                                    </span>
                                </div>

                                {/* Subcategories */}
                                <ul className="space-y-3 ml-4">
                                    {category.subcategories.map((sub) => (
                                        <li
                                            key={sub._id}
                                            className="text-sm cursor-pointer hover:text-gray-900 hover:scale-102 text-gray-500"
                                        >
                                            <Link
                                                href={{
                                                    pathname: `/${category._id}/${slugify(category.name, {
                                                        lower: true,
                                                    })}`,
                                                    query: {
                                                        name: slugify(sub.breed || sub.name, { lower: true }),
                                                    },
                                                }}
                                                passHref
                                            >
                                                {sub.breed || sub.name}
                                            </Link>
                                            <span className="text-xs text-gray-400">
                                                ({sub.count > 0 ? sub.count : "1"})
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

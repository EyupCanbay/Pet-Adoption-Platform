"use client";
import React, { useEffect, useState } from "react";
import {
    Drawer, Card, Typography, List, ListItem,
    Accordion, AccordionHeader, AccordionBody, IconButton
} from "@material-tailwind/react";
import {
    Bars3Icon, XMarkIcon, ChevronDownIcon
} from "@heroicons/react/24/outline";
import { getAllCategories } from "@/src/services/Category";
import { getAllSubCategories } from "@/src/services/SubCategory";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import Link from "next/link";

export function Sidebar() {
    const router = useRouter();
    const [open, setOpen] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [groupedCategories, setGroupedCategories] = useState([]);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, subCategoryRes] = await Promise.all([
                    getAllCategories(),
                    getAllSubCategories()
                ]);

                const categories = categoryRes?.data || [];
                const subCategories = subCategoryRes?.data || [];

                const grouped = categories.map((category) => {
                    const children = subCategories.filter(
                        (sub) => String(sub.category_id) === String(category._id)
                    );
                    return { ...category, subcategories: children };
                });

                setGroupedCategories(grouped);
            } catch (error) {
                console.error("Veri alınamadı:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {/* Burger Button */}
            <div className="p-4 z-50 relative">
                <IconButton variant="text" size="lg" onClick={toggleDrawer}>
                    {isDrawerOpen ? (
                        <XMarkIcon className="h-6 w-6 cursor-pointer" />
                    ) : (
                        <Bars3Icon className="h-6 w-6 cursor-pointer" />
                    )}
                </IconButton>
            </div>

            {/* Blur Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
                    onClick={toggleDrawer}
                />
            )}

            {/* Sidebar Drawer */}
            <Drawer open={isDrawerOpen} onClose={toggleDrawer} placement="left" className="z-50">
                <Card color="transparent" shadow={false} className="h-full w-full p-4">
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5">Tüm Kategoriler</Typography>
                        <IconButton variant="text" onClick={toggleDrawer}>
                            <XMarkIcon className="h-6 w-6 cursor-pointer" />
                        </IconButton>
                    </div>
                    <List>
                        {groupedCategories.map((category, index) => (
                            <Accordion
                                key={category._id}
                                open={open === index + 1}
                                icon={
                                    <ChevronDownIcon
                                        strokeWidth={2.5}
                                        className={`h-4 w-4 transition-transform ${open === index + 1 ? "rotate-180" : ""}`}
                                    />
                                }
                            >
                                <ListItem className="p-0" selected={open === index + 1}>
                                    <AccordionHeader
                                        onClick={() => handleOpen(index + 1)}
                                        className="border-b-0 p-3 cursor-pointer"
                                    >
                                        <Typography className="mr-auto font-semibold capitalize">
                                            {category.name}
                                        </Typography>
                                    </AccordionHeader>
                                </ListItem>
                                <AccordionBody className="py-1">
                                    <List className="p-0 pl-4">
                                        {category.subcategories.map((sub) => (
                                            <ListItem key={sub._id}>
                                                <Link
                                                    href={{
                                                        pathname: `/${category._id}/${slugify(category.name, { lower: true })}`,
                                                        query: { name: slugify(sub.breed, { lower: true }) },
                                                    }}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {sub.breed}
                                                </Link>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionBody>
                            </Accordion>
                        ))}

                        {/* Kayıp İlanlar */}
                        <ListItem
                            className="p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                            onClick={() => router.push("/lost-pets")}
                        >
                            <Typography className="font-semibold capitalize">Kayıp İlanlar</Typography>
                        </ListItem>
                    </List>
                </Card>
            </Drawer>
        </>
    );
}

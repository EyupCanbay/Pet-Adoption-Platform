import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Popover,
    PopoverHandler,
    PopoverContent,
    Avatar,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    FlagIcon,
    FolderIcon,
    WrenchScrewdriverIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/userProvider";
import { LogoutUser } from "@/src/services/Auth";
import { useState } from "react";

const MENU_ITEMS = [
    { label: "Kullanıcılar", value: "users", icon: <UsersIcon className="h-5 w-5" /> },
    { label: "İlanlar", value: "listings", icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { label: "Kayıp İlanlar", value: "lostlistings", icon: <InboxIcon className="h-5 w-5" /> },
    { label: "Şikayetler", value: "reports", icon: <FlagIcon className="h-5 w-5" /> },
    { label: "Kategoriler", value: "categories", icon: <FolderIcon className="h-5 w-5" /> },
    { label: "Alt Kategoriler", value: "subcategories", icon: <FolderIcon className="h-5 w-5" /> },
    { label: "Log Kayıtları", value: "logs", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
];

export function AdminSidebar({ activeTab, setActiveTab }) {
    const user = useUser();
    const router = useRouter();
    const [ownerImageError, setOwnerImageError] = useState(false);

    const handleLogout = async () => {
        await LogoutUser();
        window.location.href = "/login";
    };

    const handleSettings = () => {
        router.push("/settings");
    };

    return (
        <Card className="h-screen w-full max-w-[16rem] rounded-none bg-zinc-900 text-white border-r border-gray-800 flex flex-col justify-between">
            <div>
                <div className="mb-4 flex items-center justify-center px-4 py-6">
                    <Typography
                        onClick={() => router.push("/")}
                        variant="h4"
                        className="cursor-pointer text-white"
                    >
                        Pet Adoption
                    </Typography>
                </div>

                <List className="text-sm">
                    {MENU_ITEMS.map((item, index) => (
                        <ListItem
                            key={index}
                            onClick={() => setActiveTab(item.value)}
                            className={`group gap-2 hover:border-r-2 hover:border-red-500 font-semibold rounded-none cursor-pointer
                ${activeTab === item.value
                                    ? "bg-gray-800 border-r-2 border-red-500 text-red-500"
                                    : "hover:bg-gray-800 hover:text-red-400"}`}
                        >
                            <ListItemPrefix className={`${activeTab === item.value ? "text-red-500" : "group-hover:text-red-400"}`}>
                                {item.icon}
                            </ListItemPrefix>
                            {item.label}
                        </ListItem>
                    ))}
                </List>
            </div>

            {/* Profil ve Popover */}
            <div className="px-4 pb-6">
                <Popover placement="top">
                    <PopoverHandler>
                        <div className="flex items-center gap-3 cursor-pointer">
                            <Avatar
                                src={ownerImageError || !user?.user?.data?.user?.profilePicture
                                    ? "/default-avatar.jpg"
                                    : user?.user?.data?.user?.profilePicture}
                                onError={() => setOwnerImageError(true)}
                                alt="Profile Picture"
                                className="w-12 h-12"
                            />
                            <div className="flex flex-col">
                                <Typography variant="h6" color="white">
                                    {user?.user?.data?.user?.name} {user?.user?.data?.user?.surname}
                                </Typography>
                                <Typography variant="small" className="text-gray-400">
                                    {user?.user?.data?.user?.job || "User"}
                                </Typography>
                            </div>
                        </div>
                    </PopoverHandler>

                    <PopoverContent className="w-full max-w-[14rem] border-none bg-gray-100">
                        <List className="p-0 font-semibold">
                            <ListItem
                                className="cursor-pointer hover:bg-gray-200 hover:border-r-2 hover:border-red-500 text-sm group rounded-none gap-2"
                                onClick={handleSettings}
                            >
                                <ListItemPrefix className="group-hover:text-red-500">
                                    <Cog6ToothIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                Ayarlar
                            </ListItem>
                            <ListItem
                                className="cursor-pointer hover:bg-gray-200 hover:border-r-2 hover:border-red-500 text-sm group rounded-none gap-2"
                                onClick={handleLogout}
                            >
                                <ListItemPrefix className="group-hover:text-red-500">
                                    <PowerIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                Çıkış Yap
                            </ListItem>
                        </List>
                    </PopoverContent>
                </Popover>
            </div>
        </Card>
    );
}

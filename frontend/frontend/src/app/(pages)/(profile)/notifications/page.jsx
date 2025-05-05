"use client";
import React, { useEffect, useState } from 'react';
import NotificationComment from '@/src/components/notifications/NotificationComment';
import NotificationFavorite from '@/src/components/notifications/NotificationFavorite';
import NotificationGeneral from '@/src/components/notifications/NotificationGeneral';
import NotificationReply from '@/src/components/notifications/NotificationReply';
import NotificationReport from '@/src/components/notifications/NotificationReport';
import User from "@/mocks/users.json";
import NotificationsMock from "@/mocks/notifications.json";

const notificationTypes = [
    { label: "Tümü", value: "all" },
    { label: "Yorumlar", value: "comment" },
    { label: "Yanıtlar", value: "reply" },
    { label: "Favoriler", value: "favorite" },
    { label: "Şikayetler", value: "report" },
    { label: "Genel", value: "general" }
];

function Notifications() {
    const [currentUser, setCurrentUser] = useState(null);
    const [allNotifications, setAllNotifications] = useState([]);
    const [selectedType, setSelectedType] = useState("all");

    useEffect(() => {
        setCurrentUser(User?.data[0]);
    }, []);

    useEffect(() => {
        if (currentUser) {
            const userNotifications = NotificationsMock?.data
                .filter(n => n.recipient_id === currentUser._id)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Tarihe göre azalan sırala
            setAllNotifications(userNotifications);
        }
    }, [currentUser]);

    const renderNotificationComponent = (notif) => {
        switch (notif.type) {
            case "comment":
                return <NotificationComment key={Math.random()} notification={notif} />;
            case "reply":
                return <NotificationReply key={Math.random()} notification={notif} />;
            case "favorite":
                return <NotificationFavorite key={Math.random()} notification={notif} />;
            case "report":
                return <NotificationReport key={Math.random()} notification={notif} />;
            case "general":
                return <NotificationGeneral key={Math.random()} notification={notif} />;
            default:
                return null;
        }
    };

    const filteredNotifications =
        selectedType === "all"
            ? allNotifications
            : allNotifications.filter(n => n.type === selectedType);

    return (
        <div className="p-4 max-w-3xl mx-auto">
            {/* Filtre Butonları */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {notificationTypes.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setSelectedType(value)}
                        className={`px-3 py-1 rounded text-sm border cursor-pointer transition-colors duration-200 
                            ${selectedType === value ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Bildirimler */}
            <div className="space-y-4">
                {filteredNotifications.map(notif => renderNotificationComponent(notif))}
                {filteredNotifications.length === 0 && (
                    <p className="text-gray-500 text-sm">Hiç bildirim yok.</p>
                )}
            </div>
        </div>
    );
}

export default Notifications;

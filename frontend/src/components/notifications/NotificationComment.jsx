"use client";
import User from "@/mocks/users.json";
import { useEffect, useState } from "react";

const NotificationComment = ({ notification, user }) => {
    const [initiator, setInitiator] = useState(null);

    useEffect(() => {
        if (notification?.initiator) {
            const initiatorData = User?.data.find(u => u._id === notification.initiator);
            setInitiator(initiatorData);
        }
    }, [notification]);

    return (
        <div className="border p-4 rounded shadow-sm">
            <p><strong>{initiator?.userName}</strong> bir gönderinize yorum yaptı:</p>
            <p className="italic">"{notification?.message}"</p>
            <small>{new Date(notification?.createdAt).toLocaleString()}</small>
        </div>
    );
};

export default NotificationComment;

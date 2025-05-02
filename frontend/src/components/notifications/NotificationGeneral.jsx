"use client";

const NotificationGeneral = ({ notification }) => {
    return (
        <div className="border p-4 rounded shadow-sm bg-yellow-50">
            <p className="font-semibold">Sistem Bildirimi:</p>
            <p>{notification?.message}</p>
            <small>{new Date(notification?.createdAt).toLocaleString()}</small>
        </div>
    );
};

export default NotificationGeneral;

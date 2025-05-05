"use client";
import User from "@/mocks/users.json";
import { useEffect, useState } from "react";

const NotificationReport = ({ notification }) => {
  const [initiator, setInitiator] = useState(null);

  useEffect(() => {
    if (notification?.initiator) {
      const initiatorData = User?.data.find(u => u._id === notification.initiator);
      setInitiator(initiatorData);
    }
  }, [notification]);

  return (
    <div className="border p-4 rounded shadow-sm bg-red-50">
      <p><strong>{initiator?.userName}</strong> bir içeriğinizi şikayet etti:</p>
      <p className="italic text-sm">"{notification?.message}"</p>
      <p className="text-xs mt-1">Şikayet edilen içerik: <strong>{notification?.targetType}</strong></p>
      {/* BURAYA MODELDEKİ PETLİST YA DA LOSTPETLİST İD GELECEK BACKEND ENTEGRE EDİLİNCE BAK */}
      <small>{new Date(notification?.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default NotificationReport;

"use client";
import User from "@/mocks/users.json";
import { useEffect, useState } from "react";

const NotificationFavorite = ({ notification }) => {
  const [initiator, setInitiator] = useState(null);

  useEffect(() => {
    if (notification?.initiator) {
      const initiatorData = User?.data.find(u => u._id === notification.initiator);
      setInitiator(initiatorData);
    }
  }, [notification]);

  const listingName = notification?.petListingName || notification?.lostPetListingName;

  return (
    <div className="border p-4 rounded shadow-sm">
      <p><strong>{initiator?.userName}</strong> bir ilanınızı favorilere ekledi:</p>
      <p className="italic">"{listingName}"</p>
      <small>{new Date(notification?.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default NotificationFavorite;

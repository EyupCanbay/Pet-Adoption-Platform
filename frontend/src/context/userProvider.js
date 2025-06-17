"use client"; 

import { createContext, useContext, useState, useEffect } from "react";
const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default function UserProvider({ user: initialUserProp, children }) {
  const [currentUser, setCurrentUser] = useState(initialUserProp);

  useEffect(() => {
    if (initialUserProp !== currentUser) {
      setCurrentUser(initialUserProp);
    }
  }, [initialUserProp, currentUser]);
  return (
    <UserContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}
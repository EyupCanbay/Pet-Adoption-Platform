"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export default function UserProvider({ user: initialUser, children }) {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

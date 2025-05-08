"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export default function UserProvider({ user, children }) {
  const [initialUser, setInitialUser] = useState(user);

  return (
    <UserContext.Provider value={{ user, setInitialUser }}>
      {children}
    </UserContext.Provider>
  );
}

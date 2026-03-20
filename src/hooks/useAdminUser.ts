"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { auth } from "@/lib/admin/firebase";

export function useAdminUser() {
  const [user, setUser] = React.useState<User | null | undefined>(undefined);
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  return user;
}

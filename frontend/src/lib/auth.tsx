"use client";

import { useEffect, useState } from "react";
import { api } from "./axios";

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
} | null;

export async function getUser(): Promise<User> {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then((userData) => {
      setUser(userData);
      setLoading(false)
    });
  }, []);

  return { user, isLoading };
}

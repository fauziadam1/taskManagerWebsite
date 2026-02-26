import { useEffect, useState } from "react";
import { api } from "./axios";

export type User = {
  id: string;
  name: string;
  username: string;
  image: string;
} | null;

export async function getUser(): Promise<User> {
  try {
    const res = await api.get("/api/me");
    return res.data;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    getUser().then((userData) => {
      setUser(userData);
    });
  }, []);

  return { user };
}

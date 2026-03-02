"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Rows3, LogIn } from "lucide-react";
import { SearchBar } from "./searchbar";
import { Button } from "./ui/button";
import { HeaderUser } from "./header-user";

export function Header() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between w-full px-5 py-3 border-b z-1000 bg-white">
      <Link href={"/"} className="flex items-center justify-center gap-2">
        <Rows3 className="bg-black text-white p-1 w-6 h-6 rounded-md" />
        <h1 className="font-semibold">Impact</h1>
      </Link>
      <SearchBar />
      {user ? (
        <HeaderUser user={user} />
      ) : (
        <div>
          <Link href={"/login"}>
            <Button variant="outline">
              <LogIn />
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

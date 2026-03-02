"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return children;
}

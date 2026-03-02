"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { PropsWithChildren, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function RootLayout({ children }: PropsWithChildren) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SidebarProvider className="flex flex-1">
        <AppSidebar />
        <SidebarInset className="w-fit">
          <SidebarTrigger className="m-2 -translate-x-2 cursor-pointer" />
        </SidebarInset>
        <div className="w-full">{children}</div>
      </SidebarProvider>
    </div>
  );
}

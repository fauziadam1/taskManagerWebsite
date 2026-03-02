"use client";

import { useAuth } from "@/lib/auth";
import { WorkspaceCard } from "@/components/workspace-card";
import { Star, Users2 } from "lucide-react";
import { StarCard } from "@/components/star-card";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="py-10 flex flex-col gap-20">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl">Welcome, {user?.name} 👋</h1>
        <p className="font-semibold text-sm text-gray-400">
          Let&apos;s turn your ideas into action! Manage your projects,
          collaborate with your team, and stay on top of everything
          effortlessly.
        </p>
      </div>
      <div className="space-y-4">
        <h1 className="font-semibold text-xl flex items-center gap-2">
          <Star className="size-5" />
          Board Starred
        </h1>
        <StarCard />
      </div>
      <div className="space-y-4">
        <h1 className="font-semibold text-xl flex items-center gap-2">
          <Users2 className="size-5" />
          Your Team Space
        </h1>
        <WorkspaceCard />
      </div>
    </div>
  );
}

import { api } from "@/lib/axios";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Workspace = {
  id: string;
  title: string;
};

export function WorkspaceCard() {
  const [workspace, setWorkspace] = useState<Workspace[]>([]);

  const fetchWorkspace = async () => {
    try {
      const res = await api.get("/api/workspaces");
      setWorkspace(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkspace();
  });

  return (
    <div>
      {workspace.length === 0 ? (
        <div>
          <h1 className="text-sm font-semibold text-gray-400">
            Klik tombol + di sidebar untuk menambahkan Space
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {workspace.map((w) => (
            <Link
              href={"/"}
              key={w.id}
              className="group relative sm:max-w-50 border rounded-xl overflow-hidden col-span-1"
            >
              {/* <Button variant="ghost" className="absolute hover:bg-gray-200 opacity-0 translate-x-10 rounded-full w-9 h-9 right-1 top-1 group-hover:opacity-100 group-hover:translate-x-0">
                <Star />
              </Button> */}
              <div className="w-full h-20 bg-gray-100"></div>
              <div className="px-2 py-3">
                <h1 className="text-sm font-semibold line-clamp-2">{w.title}</h1>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

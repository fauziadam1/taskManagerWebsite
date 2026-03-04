import { api } from "@/lib/axios";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Board = {
  id: string;
  title: string;
  star: boolean;
};

export function WorkspaceCard() {
  const [boards, setBoard] = useState<Board[]>([]);

  const fetchBoard = async () => {
    try {
      const res = await api.get("/api/boards");
      setBoard(res.data);
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
    fetchBoard();
  });

  const toggleStar = async (id: string) => {
    try {
      const res = await api.put(`/api/board/${id}/star`);
      setBoard((prev) =>
        prev.map((s) => (s.id === id ? { ...s, star: res.data.data.star } : s)),
      );
    } catch {}
  };

  return (
    <div>
      {boards.length === 0 ? (
        <div>
          <h1 className="text-sm font-semibold text-gray-400">
            Klik tombol + di sidebar untuk menambahkan Space
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {boards
            .filter((b) => b.star === false)
            .map((b) => (
              <Link
                href={`/board/${b.id}`}
                key={b.id}
                className="group relative sm:max-w-full border rounded-xl overflow-hidden col-span-1"
              >
                <Button
                  variant="ghost"
                  className="absolute hover:bg-gray-200 opacity-0 translate-x-10 rounded-full w-9 h-9 right-1 top-1 group-hover:opacity-100 group-hover:translate-x-0 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleStar(b.id);
                  }}
                >
                  <Star
                    className={b.star ? "fill-yellow-400 text-yellow-400" : ""}
                  />
                </Button>
                <div className="w-full h-20 bg-gray-100"></div>
                <div className="px-2 py-3">
                  <h1 className="text-sm font-semibold line-clamp-2">
                    {b.title}
                  </h1>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

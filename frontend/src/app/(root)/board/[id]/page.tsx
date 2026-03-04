"use client";

import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { ListDialog } from "@/components/list-create-dialog";
import { ListCard } from "@/components/list-card";

type Board = {
  id: string;
  title: string;
};

export default function BoardPage() {
  const params = useParams();
  const [title, setTitle] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [boards, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const fetchBoard = async (id: string) => {
      if (!params?.id) return;
      try {
        const res = await api.get(`/api/board/${id}`);
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
    if (params?.id) {
      fetchBoard(params.id as string);
    }
  }, [params?.id]);

  useEffect(() => {
    if (boards) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(boards.title);
    }
  }, [boards]);

  const updateTitle = async () => {
    if (!boards) return;
    try {
      await api.put(`/api/board/${boards.id}`, {
        title: title,
      });

      setBoard({ ...boards, title: title });
      setEdit(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  if (!boards) {
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner className="size-7" />
    </div>;
  }

  return (
    <div>
      <div className="py-2.5 cursor-pointer">
        {isEdit ? (
          <div className="flex items-center justify-between">
            <div className="w-fit border rounded-sm">
              <input
                className="w-fit font-semibold border-none outline-none text-xs p-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTitle();
                  }
                }}
                onBlur={() => setEdit(false)}
                autoFocus
              />
            </div>
            <ListDialog id={boards?.id} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="font-semibold" onClick={() => setEdit(true)}>
              {boards?.title}
            </h1>
            <ListDialog id={boards?.id} />
          </div>
        )}
      </div>
      <div>
        <ListCard id={boards?.id} />
      </div>
    </div>
  );
}

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { TaskDialog } from "./task-create-dialog";
import {
  ChevronDown,
  ChevronUp,
  CircleSmall,
  MoreHorizontalIcon,
  Pencil,
  Trash2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

type Props = {
  id: string | undefined;
};

type List = {
  id: string;
  title: string;
  sort_order: number;
};

type Task = {
  id: string;
  title: string;
  description: string;
  list_id: string;
};

export function ListCard({ id }: Props) {
  const [list, setList] = useState<List[]>([]);
  const [tasks, setTask] = useState<Task[]>([]);

  const topSortOrder = Math.min(...list.map((l) => l.sort_order));
  const bottomSortOrder = Math.max(...list.map((l) => l.sort_order));

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/api/cards`);
        setTask(res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error.message ??
          "Something went wrong";
        toast.error(message);
      }
    };
    fetchTask();
  });

  useEffect(() => {
    const fetchList = async () => {
      if (!id) return;

      try {
        const res = await api.get(`/api/board/${id}/lists`);
        setList(res.data);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error.message ??
          "Something went wrong";
        toast.error(message);
      }
    };
    fetchList();
  });

  const moveUp = async (id: string, order: number) => {
    try {
      await api.put(`/api/reorder/list/${id}`, {
        new_position: order + 1,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.response ??
        "Something went wrong";
      toast.error(message);
    }
  };

  const moveDown = async (id: string, order: number) => {
    try {
      await api.put(`/api/reorder/list/${id}`, {
        new_position: order - 1,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.response ??
        "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-3">
      {list.map((l) => (
        <Card key={l.id} className="flex items-center">
          <CardHeader className="w-full items-center">
            <CardTitle className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <h1 className="flex items-center">
                  <CircleSmall />
                  {l.title}
                </h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="font-semibold text-xs">
                      <Pencil className="size-3.5" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-semibold text-xs"
                      variant="destructive"
                    >
                      <Trash2Icon className="size-3.5 text-destructive" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => moveUp(l.id, l.sort_order)}
                  disabled={l.sort_order === bottomSortOrder}
                >
                  <ChevronUp />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => moveDown(l.id, l.sort_order)}
                  disabled={l.sort_order === topSortOrder}
                >
                  <ChevronDown />
                </Button>
              </ButtonGroup>
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full space-y-3">
            {tasks
              .filter((t) => t.list_id === l.id)
              .map((t) => (
                <div
                  key={t.id}
                  className="w-full border p-2 rounded-lg bg-gray-50"
                >
                  <div className="w-full">
                    <h1 className="font-semibold text-sm">{t.title}</h1>
                  </div>
                </div>
              ))}
            <TaskDialog id={l.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

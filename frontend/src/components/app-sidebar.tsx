"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "./ui/form";
import {
  ChevronDownIcon,
  HomeIcon,
  MoreHorizontalIcon,
  Pencil,
  PlusIcon,
  Rows3,
  Star,
  Trash2Icon,
  UsersRound,
} from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

type Workspace = {
  id: string;
  title: string;
};

type Board = {
  id: string;
  title: string;
  workspace_id: string;
  star: boolean;
};

type Starred = {
  id: string;
  title: string;
};

export function AppSidebar() {
  const [openSpace, setOpenSpace] = useState(false);
  const [openBoard, setOpenBoard] = useState<string | null>(null);
  const [boards, setBoard] = useState<Board[]>([]);
  const [star, setStar] = useState<Starred[]>([]);
  const [isWedit, setWedit] = useState<string | null>(null);
  const [isBedit, setBedit] = useState<string | null>(null);
  const [isWtitle, setWtitle] = useState<string>("");
  const [isBtitle, setBtitle] = useState<string>("");
  const [workspace, setWorkspace] = useState<Workspace[]>([]);

  const FormWorkspace = z.object({
    title: z.string().trim().min(1, "Space name field is required"),
  });

  type formWorkspace = z.infer<typeof FormWorkspace>;

  const formW = useForm<formWorkspace>({
    resolver: zodResolver(FormWorkspace),
    defaultValues: {
      title: "",
    },
  });

  const FormBoard = z.object({
    title: z.string().trim().min(1, "Board name field is required"),
  });

  type formBoard = z.infer<typeof FormBoard>;

  const formB = useForm<formBoard>({
    resolver: zodResolver(FormBoard),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await api.get("/api/workspaces");
        setWorkspace(res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error.message ??
          "Someting went wrong";
        toast.error(message);
      }
    };

    fetchWorkspace();
  }, []);

  const addWorkspace = async (data: formWorkspace) => {
    try {
      const res = await api.post("/api/workspace", data);

      setWorkspace((prev) => [...prev, res.data.data]);
      setOpenSpace(false);
      formW.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  const updateWorkspace = async (id: string) => {
    try {
      await api.put(`/api/workspace/${id}`, { title: isWtitle });
      setWorkspace((prev) =>
        prev.map((w) => (w.id === id ? { ...w, title: isWtitle } : w)),
      );
      setWedit(null);
      toast.success("Name updated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (!id) return;

    try {
      await api.delete(`/api/workspace/${id}`);
      setWorkspace((prev) => prev.filter((w) => w.id !== id));
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
    const fetchBoard = async () => {
      try {
        const res = await api.get(`/api/boards`);
        setBoard(res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error.message ??
          "Someting went wrong";
        toast.error(message);
      }
    };

    fetchBoard();
  }, []);

  const fetchStar = async () => {
    try {
      const res = await api.get(`/api/boards/starred`);
      setStar(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Someting went wrong";
      toast.error(message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStar();
  });

  const addBoard = async (data: formBoard, workspace_id: string) => {
    if (!workspace_id) return;

    try {
      const res = await api.post("/api/board", {
        ...data,
        workspace_id,
      });

      setBoard((prev) => [...prev, res.data.data]);
      setOpenBoard(null);
      formB.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  const updateBoard = async (id: string) => {
    try {
      await api.put(`/api/board/${id}`, { title: isBtitle });
      setBoard((prev) =>
        prev.map((b) => (b.id === id ? { ...b, title: isBtitle } : b)),
      );
      setBedit(null);
      toast.success("Name updated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  const deleteBoard = async (BId: string) => {
    if (!BId) return;

    try {
      await api.delete(`/api/board/${BId}`);
      setBoard((prev) => prev.filter((b) => b.id !== BId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  const toggleStar = async (id: string) => {
    if (!id) return;

    try {
      const res = await api.put(`/api/board/${id}/star`);
      setBoard((prev) =>
        prev.map((b) => (b.id === id ? { ...b, star: res.data.data.star } : b)),
      );

      await fetchStar();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarGroup>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="default"
                className="font-semibold"
                asChild
              >
                <Link href={"/"}>
                  <HomeIcon />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible className="data-[state=open]">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="group font-semibold">
                    <Star className="size-4" />
                    Starred
                    <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {star.length === 0 ? (
                      <SidebarMenuSubItem className="text-xs text-gray-500">
                        Klik tombol ⭐ untuk mengubah ke star board
                      </SidebarMenuSubItem>
                    ) : (
                      star.map((st) => (
                        <SidebarMenuSubButton
                          key={st.id}
                          href={`/board/${st.id}`}
                          className="w-full text-xs font-semibold"
                        >
                          <Rows3 />
                          <span className="flex-1 truncate">{st.title}</span>
                        </SidebarMenuSubButton>
                      ))
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible className="data-[state=open]">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="group font-semibold whitespace-nowrap">
                    <UsersRound className="size-4" />
                    Team Space
                    <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="pr-0">
                    {workspace.length === 0 ? (
                      <SidebarMenuSubItem className="text-xs text-gray-500">
                        Klik tombol + untuk menambahkan Team Space
                      </SidebarMenuSubItem>
                    ) : (
                      workspace.map((w) => (
                        <SidebarMenuSubItem key={w.id}>
                          <Collapsible>
                            <div className="flex items-center">
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton className="data-[state=open] group/workspace w-full text-xs font-semibold relative">
                                  <span className="relative w-5 h-5 flex items-center justify-center text-[8px] rounded-sm bg-blue-500 text-white overflow-hidden">
                                    <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover/workspace:opacity-0">
                                      {w.title?.substring(0, 2).toUpperCase()}
                                    </span>
                                    <ChevronDownIcon className="absolute inset-0 m-auto size-3 opacity-0 duration-300 group-hover/workspace:opacity-100 transition-transform group-data-[state=open]/workspace:rotate-180" />
                                  </span>
                                  {isWedit === w.id ? (
                                    <input
                                      className="h-5.5 w-28 pl-1  border rounded-sm text-xs"
                                      value={isWtitle}
                                      onChange={(e) =>
                                        setWtitle(e.target.value)
                                      }
                                      onBlur={() => setWedit(null)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          updateWorkspace(w.id);
                                        }
                                      }}
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="flex-1 truncate whitespace-nowrap">
                                      {w.title}
                                    </span>
                                  )}
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="size-2 hover:bg-accent w-5 h-5"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MoreHorizontalIcon className="ml-auto" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="sm:max-w-sm translate-x-13">
                                  <DropdownMenuItem
                                    className="text-xs font-semibold"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setWedit(w.id);
                                      setWtitle(w.title);
                                    }}
                                  >
                                    <Pencil className="size-3.5" />
                                    Rename
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        variant="destructive"
                                        className="text-xs font-semibold text-destructive"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                        }}
                                      >
                                        <Trash2Icon className="size-3.5 text-destructive" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="sm:max-w-sm">
                                      <AlertDialogHeader key={w.id}>
                                        <AlertDialogTitle>
                                          <span className="flex items-center gap-2">
                                            <Trash2Icon className="text-destructive bg-red-50 w-9 h-9 p-2 rounded-lg" />
                                            <span>Delete: {w.title}</span>
                                          </span>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete your Team
                                          Space from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-100 text-red-500 hover:bg-red-200"
                                          onClick={() => deleteWorkspace(w.id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CollapsibleContent>
                              <SidebarMenuSub className="pl-4 pr-0">
                                {boards.filter((b) => b.workspace_id === w.id)
                                  .length === 0 ? (
                                  <SidebarMenuSubItem className="text-xs text-gray-500">
                                    Klik tombol + untuk menambahkan Board
                                  </SidebarMenuSubItem>
                                ) : (
                                  boards
                                    .filter((b) => b.workspace_id === w.id)
                                    .map((b) => (
                                      <SidebarMenuSubItem key={b.id}>
                                        <div className="flex items-center">
                                          {isBedit === b.id ? (
                                            <div className="flex items-center text-xs pl-1.5 gap-1">
                                              <Rows3 className="size-5" />
                                              <input
                                                className="border h-5.5 w-full text-xs pl-1 rounded-sm font-semibold"
                                                value={isBtitle}
                                                onChange={(e) =>
                                                  setBtitle(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") {
                                                    updateBoard(b.id);
                                                  }
                                                }}
                                                onBlur={() => setBedit(null)}
                                                onSelect={(e) =>
                                                  e.preventDefault()
                                                }
                                                autoFocus
                                              />
                                            </div>
                                          ) : (
                                            <SidebarMenuSubButton
                                              href={`/board/${b.id}`}
                                              className="w-full text-xs font-semibold"
                                            >
                                              <Rows3 />
                                              <span className="flex-1 truncate">
                                                {b.title}
                                              </span>
                                            </SidebarMenuSubButton>
                                          )}
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                className="size-2 hover:bg-accent w-5 h-5"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                }}
                                              >
                                                <MoreHorizontalIcon className="ml-auto" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="translate-x-13">
                                              <DropdownMenuItem
                                                className="text-xs font-semibold"
                                                onClick={() => {
                                                  setBedit(b.id);
                                                  setBtitle(b.title);
                                                }}
                                              >
                                                <Pencil className="size-3.5" />
                                                Rename
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                className="text-xs font-semibold"
                                                onClick={() => toggleStar(b.id)}
                                              >
                                                <Star
                                                  className={
                                                    b.star
                                                      ? "size-3.5 fill-yellow-400 text-yellow-400"
                                                      : "size-3.5"
                                                  }
                                                />
                                                Star
                                              </DropdownMenuItem>
                                              <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                  <DropdownMenuItem
                                                    variant="destructive"
                                                    className="text-xs text-destructive font-semibold"
                                                    onSelect={(e) =>
                                                      e.preventDefault()
                                                    }
                                                  >
                                                    <Trash2Icon className="size-3.5 text-destructive" />
                                                    Delete
                                                  </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="sm:max-w-sm">
                                                  <AlertDialogHeader key={b.id}>
                                                    <AlertDialogTitle>
                                                      <span className="flex items-center gap-2">
                                                        <Trash2Icon className="text-destructive bg-red-50 w-9 h-9 p-2 rounded-lg" />
                                                        <span>
                                                          Delete: {b.title}
                                                        </span>
                                                      </span>
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                      This action cannot be
                                                      undone. This will
                                                      permanently delete your
                                                      Board Project from our
                                                      servers.
                                                    </AlertDialogDescription>
                                                  </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                      Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                      className="bg-red-100 text-red-500 hover:bg-red-200"
                                                      onClick={() =>
                                                        deleteBoard(b.id)
                                                      }
                                                    >
                                                      Delete
                                                    </AlertDialogAction>
                                                  </AlertDialogFooter>
                                                </AlertDialogContent>
                                              </AlertDialog>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </SidebarMenuSubItem>
                                    ))
                                )}
                                <SidebarMenuSubItem>
                                  <Dialog
                                    open={openBoard === w.id}
                                    onOpenChange={(open) =>
                                      setOpenBoard(open ? w.id : null)
                                    }
                                  >
                                    <DialogTrigger asChild>
                                      <SidebarMenuSubButton className="text-xs font-semibold">
                                        <PlusIcon />
                                        New Board
                                      </SidebarMenuSubButton>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-sm">
                                      <DialogHeader>
                                        <DialogTitle>Create Board</DialogTitle>
                                        <DialogDescription>
                                          A board for track task and your
                                          projects.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <Form {...formB}>
                                        <form
                                          onSubmit={formB.handleSubmit((data) =>
                                            addBoard(data, w.id),
                                          )}
                                          className="space-y-5"
                                        >
                                          <div>
                                            <FormField
                                              control={formB.control}
                                              name="title"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Name</FormLabel>
                                                  <FormControl>
                                                    <Input {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          <DialogFooter>
                                            <DialogClose asChild>
                                              <Button variant="outline">
                                                Cancel
                                              </Button>
                                            </DialogClose>
                                            <Button type="submit">
                                              Create
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </Form>
                                    </DialogContent>
                                  </Dialog>
                                </SidebarMenuSubItem>
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        </SidebarMenuSubItem>
                      ))
                    )}
                    <SidebarMenuSubItem>
                      <Dialog open={openSpace} onOpenChange={setOpenSpace}>
                        <DialogTrigger asChild>
                          <SidebarMenuSubButton
                            className="text-xs font-semibold"
                            onClick={() => setOpenSpace(true)}
                          >
                            <PlusIcon />
                            New Space
                          </SidebarMenuSubButton>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-sm">
                          <Form {...formW}>
                            <form
                              onSubmit={formW.handleSubmit(addWorkspace)}
                              className="space-y-4"
                            >
                              <DialogHeader>
                                <DialogTitle>Create Space</DialogTitle>
                                <DialogDescription>
                                  A Space represents teams, departments, groups,
                                  or personal.
                                </DialogDescription>
                              </DialogHeader>
                              <FormField
                                control={formW.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g Marketing, Engineering"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline" type="button">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button type="submit">Create</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>
    </Sidebar>
  );
}

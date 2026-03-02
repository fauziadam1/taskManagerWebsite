import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { LogOutIcon, User2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { Separator } from "radix-ui";

export function HeaderUser({
  user,
}: {
  user: {
    id: string;
    name: string;
    username: string;
    image?: string;
    email: string;
  };
}) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await api.post("/api/logout");

      localStorage.removeItem("token");
      setLoading(false);
      router.replace("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error.message ?? "Logout failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={user.image} alt={user.name} className="grayscale" />
          <AvatarFallback className="border ">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="-translate-x-5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-gray-600">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem disabled>
            <Avatar>
              <AvatarImage
                src={user.image}
                alt={user.name}
                className="grayscale border"
              />
              <AvatarFallback className="border">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="flex flex-col">
              <h1 className="text-xs font-semibold">{user.name}</h1>
              <p className="text-[10px]">{user.email}</p>
            </span>
          </DropdownMenuItem>
          <Sheet>
            <SheetTrigger asChild>
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <Link href={"/"} className="font-semibold text-xs">
                  <User2Icon />
                  Profile
                </Link>
              </DropdownMenuItem>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Profile</SheetTitle>
              </SheetHeader>
              <div className="px-4.5">
                <div className="flex items-center gap-2 w-full h-10">
                  <Avatar className="w-10 h-full">
                    <AvatarImage
                      src={user.image}
                      alt={user.name}
                      className="grayscale border"
                    />
                    <AvatarFallback className="border">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col">
                    <h1 className="text-md font-semibold">{user.name}</h1>
                    <p className="text-sm">{user.email}</p>
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="text-xs font-semibold"
            variant="destructive"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <LogOutIcon className="text-destructive" />
            )}
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

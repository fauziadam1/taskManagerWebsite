"use client";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "./ui/form";
import z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "./ui/password-input";
import { Rows3 } from "lucide-react";
import { Spinner } from "./ui/spinner";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().trim().min(1, "This field is required"),
    password: z.string().trim().min(1, "This field is required"),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (form: FormSchema) => {
    setLoading(true);
    try {
      const res = await api.post("/api/login", form);
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);

      toast.success("Login Succes");
      router.push("/");
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error.message ?? "Login Failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border w-120 p-7 rounded-xl space-y-5"
        >
          <div className="flex flex-col items-center gap-2 mb-10">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md size-8 bg-primary">
                <Rows3 className="size-6 stroke-primary-foreground" />
              </div>
              <span className="sr-only">Impact</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold">Welcome to Impact</h1>
              <p className="text-xs">Login with your account to continue</p>
            </div>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      className="[&::-ms-reveal]:hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLoading ? <Spinner /> : "Login"}
            </Button>
          </div>
          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

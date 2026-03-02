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
import { Rows3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PasswordSchema } from "@/lib/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "./ui/password-input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const formSchema = z
    .object({
      name: z.string().trim().min(1, "The name field is required"),
      username: z.string().trim().min(1, "The username field is required"),
      email: z.email().trim().min(1, "The email field is required"),
      password: PasswordSchema,
      password_confirmation: z
        .string()
        .trim()
        .min(1, "The confirm field is required"),
    })
    .refine((values) => values.password === values.password_confirmation, {
      message: "The confirm password deos not match",
      path: ["password_confirmation"],
    });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const res = await api.post("/api/register", data);
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);

      toast.success("Register Success");
      router.replace("/");
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error.message ?? "Register failed";
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
              <p className="text-xs">Create your own account!</p>
            </div>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe_01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@gmail.com" {...field} />
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
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLoading ? <Spinner /> : "Register"}
            </Button>
          </div>
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href={"/login"} className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

import { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login Page",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <LoginForm />
    </div>
  );
}

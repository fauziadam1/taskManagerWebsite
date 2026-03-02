import { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Register Page",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <RegisterForm />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Swal from "sweetalert2";

type Mode = "login" | "register";

interface FormState {
  name:     string;
  email:    string;
  password: string;
}

const DEFAULT_FORM: FormState = { name: "", email: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isLoading } = useAuthStore();

  const [mode, setMode]   = useState<Mode>("login");
  const [form, setForm]   = useState<FormState>(DEFAULT_FORM);
  const [error, setError] = useState("");

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setForm(DEFAULT_FORM);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (mode === "register" && !form.name) {
      setError("Name is required");
      return;
    }

    try {
      if (mode === "login") {
        await login(form.email, form.password);
        await Swal.fire({
          icon: "success",
          title: "Successfully logged in!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/dashboard");
      } else {
        await register(form.name, form.email, form.password);
        await Swal.fire({
          icon: "success",
          title: "Successfully registered!",
          text: "Please log in.",
          timer: 2000,
          showConfirmButton: false,
        });
        setMode("login");
        setForm(DEFAULT_FORM);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Something went wrong";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <Card className="w-full max-w-md shadow-md py-10 px-5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-500">
            {mode === "login" ? "Login" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Enter your credentials to continue"
              : "Register to start managing tasks"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter Your Full Name . . ."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Email Address . . ."
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full bg-blue-500" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Register"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-blue-500 font-bold hover:underline"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-blue-500 font-bold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

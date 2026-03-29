"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/authStore";

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  return null;
}

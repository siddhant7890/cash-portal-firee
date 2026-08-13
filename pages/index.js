import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function IndexPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? "/cash-counter" : "/login");
  }, [ready, user, router]);

  return null;
}

"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Button variant="destructive" onClick={logout}>
      Logout
    </Button>
  );
}

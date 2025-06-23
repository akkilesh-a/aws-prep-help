import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export const useCurrentUserEmail = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileEmail = async () => {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error(error);
      }

      setEmail(data.session?.user.email ?? "?");
    };

    fetchProfileEmail();
  }, []);

  return email || "?";
};

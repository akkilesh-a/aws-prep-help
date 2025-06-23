import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export const useLoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setLoggedIn(!!data.session?.user);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setLoggedIn(!!session?.user);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return loggedIn;
};

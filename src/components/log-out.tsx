import { useCallback } from "react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth";

export function useLogOut() {
  const { signOut } = useAuth();

  return useCallback(async () => {
    toast.info("Saindo...");
    await signOut();
  }, [signOut]);
}

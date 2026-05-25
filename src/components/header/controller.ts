import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/auth";

export function useHeaderController() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handlePage(navigation: string) {
    navigate(navigation);
  }

  return {
    userData: {
      user,
    },
    route: {
      handlePage,
      navigate,
    },
  };
}

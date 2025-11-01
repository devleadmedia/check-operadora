import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useHeaderController() {
  const navigate = useNavigate();

  function handlePage(navigation: string) {
    navigate(navigation);
  }

  const { data: user } = useQuery({
    queryKey: ["signIn"],
    queryFn: () => {
      const getUserData = localStorage.getItem("@check_operadora:user");
      const user = getUserData && JSON.parse(getUserData);

      return user;
    },
  });

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

import { useLocation } from "react-router-dom";
import { useHeaderController } from "../controller";

interface HeaderLinksProps {
  route: string;
  nameLink: string;
}

export function LinksHeader({ nameLink, route }: HeaderLinksProps) {
  const { route: routePage } = useHeaderController();
  const { handlePage } = routePage;
  const location = useLocation();

  function handleActions() {
    handlePage(route);
  }

  return (
    <button
      onClick={() => handleActions()}
      type="button"
      className="group flex items-center cursor-pointer w-full justify-center"
    >
      <span
        className={`
          text-[10px] lg:text-xs font-bold whitespace-nowrap transition-colors duration-200
          ${
            location.pathname === route
              ? "text-[#aa71ff]"
              : "text-zinc-700 dark:text-white group-hover:text-[#aa71ff]"
          }
        `}
      >
        {nameLink}
      </span>
    </button>
  );
}

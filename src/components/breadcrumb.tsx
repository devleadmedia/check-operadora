import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { usePageNavigation } from "@/hooks/use-pages-navigation";

export function BreadCrumbRoutes() {
  const location = useLocation().pathname;
  const { getBreadcrumbInfo } = usePageNavigation();

  const buildBreadcrumbPath = () => {
    const pathSegments = location
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbItems: Array<{
      name: string;
      path: string;
      icon?: ReactNode;
      isActive: boolean;
    }> = [];

    // Constrói o path incrementalmente
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const routeInfo = getBreadcrumbInfo(currentPath);
      const isLastItem = index === pathSegments.length - 1;

      if (routeInfo) {
        breadcrumbItems.push({
          name: routeInfo.name,
          path: isLastItem ? "" : routeInfo.path, // Remove link do último item
          icon: routeInfo.icon,
          isActive: isLastItem,
        });
      } else {
        // Fallback para rotas não configuradas
        breadcrumbItems.push({
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          path: isLastItem ? "" : currentPath,
          icon: undefined,
          isActive: isLastItem,
        });
      }
    });

    return breadcrumbItems;
  };

  const breadcrumbPath = buildBreadcrumbPath();

  // Não mostra breadcrumb se só tiver um item e for a home
  if (breadcrumbPath.length <= 1 && location === "/") {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbPath.map((item, index) => (
          <div
            key={`${item.path || item.name}-${index}`}
            className="flex items-center"
          >
            <BreadcrumbItem>
              {item.path ? (
                <BreadcrumbLink
                  href={item.path}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  {item.icon && (
                    <span className="flex items-center text-primary">
                      {item.icon}
                    </span>
                  )}
                  {item.name}
                </BreadcrumbLink>
              ) : (
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  {item.icon && (
                    <span className="flex items-center text-primary">
                      {item.icon}
                    </span>
                  )}
                  {item.name}
                </span>
              )}
            </BreadcrumbItem>
            {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

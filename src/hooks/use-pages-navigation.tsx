/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Check, History, ScrollText, Database, Server } from "lucide-react";

import { Checker } from "@/pages/app/checker";
import { DataTableApi } from "@/pages/app/historic-api/components/data-table-api";
import { UnderConstruction } from "@/components/under-construction";
import { useApiController } from "@/pages/app/historic-api/controller/use-api-controller";
import { GenerateBase } from "@/pages/app/generate-base";

// Tipos para a estrutura de dados
export interface NavigationItem {
  nameLink: string;
  route: string;
  icon: React.ComponentType<any>;
  page: ReactNode;
}

export interface SubmenuItem {
  name: string;
  route: string;
  icon: React.ComponentType<any>;
  page?: ReactNode;
}

export interface PageWithContent {
  name: string;
  route: string;
  page: ReactNode;
  icon?: ReactNode;
}

export interface BreadcrumbRoute {
  name: string;
  path: string;
  icon?: ReactNode;
}

export function usePageNavigation() {
  const { dataTableApi } = useApiController();

  const apiSubmenus: SubmenuItem[] = [
    {
      name: "Histórico",
      route: "/api/historico",
      icon: History,
    },
    {
      name: "Documentação",
      route: "/api/documentacao",
      icon: ScrollText,
    },
  ];

  const allPagesWithApi: PageWithContent[] = [
    {
      page: <DataTableApi data={dataTableApi} />,
      name: "API",
      route: "/api",
      icon: <Server size={16} />,
    },
    {
      page: <DataTableApi data={dataTableApi} />,
      name: "Histórico",
      route: "/api/historico",
      icon: <History size={16} />,
    },
    {
      page: <UnderConstruction title="Documentação" />,
      name: "Documentação",
      route: "/api/documentacao",
      icon: <ScrollText size={16} />,
    },
  ];

  const navigationLinks: NavigationItem[] = [
    {
      nameLink: "Checker",
      route: "/checker",
      icon: Check,
      page: <Checker />,
    },
    {
      nameLink: "Gerar Base",
      route: "/gerar-base",
      icon: Database,
      page: <GenerateBase />,
    },
  ];

  // Função para buscar informações de uma página específica
  const getPageInfo = (route: string): PageWithContent | undefined => {
    const apiPage = allPagesWithApi.find((page) => page.route === route);
    if (apiPage) return apiPage;
  };

  // Função para gerar rotas do breadcrumb baseadas nos dados
  const generateBreadcrumbRoutes = (): Record<string, BreadcrumbRoute> => {
    const routes: Record<string, BreadcrumbRoute> = {
      "/": { name: "Início", path: "/" },
    };

    // Adiciona rotas principais
    navigationLinks.forEach((link) => {
      routes[link.route] = {
        name: link.nameLink,
        path: link.route,
        icon: <link.icon size={16} />,
      };
    });

    allPagesWithApi.forEach((link) => {
      routes[link.route] = {
        name: link.name,
        path: link.route,
        icon: link.icon,
      };
    });

    return routes;
  };

  // Função para buscar informações de breadcrumb
  const getBreadcrumbInfo = (route: string): BreadcrumbRoute | undefined => {
    const routes = generateBreadcrumbRoutes();
    return routes[route];
  };

  // Função para buscar submenu por categoria
  const getSubmenuByCategory = (category: "api"): SubmenuItem[] => {
    switch (category) {
      case "api":
        return apiSubmenus;
      default:
        return [];
    }
  };

  // Função para verificar se uma rota é ativa
  const isRouteActive = (route: string, currentPath: string): boolean => {
    return currentPath === route || currentPath.startsWith(route + "/");
  };

  // Função para buscar a rota pai de uma subrota
  const getParentRoute = (route: string): string => {
    const segments = route.split("/").filter(Boolean);
    if (segments.length > 1) {
      return `/${segments[0]}`;
    }
    return "/";
  };

  return {
    // Dados principais
    navigationLinks,
    allPagesWithApi,
    apiSubmenus,

    // Funções utilitárias
    getPageInfo,
    generateBreadcrumbRoutes,
    getBreadcrumbInfo,
    isRouteActive,
    getParentRoute,
    getSubmenuByCategory,
  };
}

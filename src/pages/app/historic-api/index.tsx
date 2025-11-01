import { BreadCrumbRoutes } from "@/components/breadcrumb";
import { usePageNavigation } from "@/hooks/use-pages-navigation";

export function HistoricApi() {
  const { allPagesWithApi } = usePageNavigation();

  return (
    <>
      <BreadCrumbRoutes />

      {allPagesWithApi?.map(
        (page) => location.pathname === page.route && page.page
      )}
    </>
  );
}

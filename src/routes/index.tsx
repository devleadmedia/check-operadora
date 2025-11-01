import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const token = localStorage.getItem("@check_operadora:token");

  return (
    <BrowserRouter>{token ? <AppRoutes /> : <AuthRoutes />}</BrowserRouter>
  );
}

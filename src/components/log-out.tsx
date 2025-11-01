import { toast } from "sonner";

export function LogOut() {
  localStorage.removeItem("@check_operadora:token");
  localStorage.removeItem("@check_operadora:user");

  toast.info("Saindo...");

  setTimeout(() => {
    window.location.reload();
    window.location.href = "/";
  }, 2000);
}

import axios from "axios";
import { toast } from "sonner";
import { websocketService } from "./websocket";

const endPoint = "https://zapchecker.bigdates.com.br";

export const api = axios.create({
  baseURL: endPoint,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@check_operadora:token");

  if (
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== ""
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se erro 401 e ainda não tentou renovar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Evita múltiplas tentativas simultâneas
      if (isRefreshing) {
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(
          "@check_operadora:refresh_token"
        );

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await api.post("/auth/refresh-token", {
          refresh_token: refreshToken,
        });

        // Salva o novo token
        localStorage.setItem("@check_operadora:token", data.access_token);

        // Atualiza e reenvia a requisição
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        return api(originalRequest);
      } catch {
        // Se falhar, desloga
        localStorage.removeItem("@check_operadora:token");
        localStorage.removeItem("@check_operadora:refresh_token");
        localStorage.removeItem("@check_operadora:user");

        // Desconectar WebSocket ao deslogar
        websocketService.disconnect();

        toast.warning("Sessão expirada...");
        window.location.href = "/";
        window.location.reload();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Outros erros
    if (error.response?.status === 403) {
      localStorage.clear();
      websocketService.disconnect();
      toast.warning("Sessão expirada...");
      window.location.href = "/";
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

// Função para inicializar WebSocket após login

// Função para desconectar WebSocket ao fazer logout
export function disconnectWebSocket() {
  websocketService.disconnect();
}

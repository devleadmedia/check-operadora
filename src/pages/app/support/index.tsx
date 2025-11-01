import { useTheme } from "@/hooks/theme";
import { useEffect, useState } from "react";
import * as SupportService from "@/services/support.service";

export function SupportPage() {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    return () => {
      fetchToken();
    };
  }, [token]);

  useEffect(() => {
    setRerender(false);
    setTimeout(() => {
      setRerender(true);
    }, 1);
  }, [theme]);

  async function fetchToken() {
    try {
      setLoading(true);
      const data = await SupportService.getTokenSupport();
      setToken(data);
    } catch (error) {
      console.error("Erro ao buscar token:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full h-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-210px)]">
            <div className="flex items-center gap-2 animate-pulse">
              <div className="flex items-center gap-1 animate-pulse">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <small>Carregando...</small>
              </div>
            </div>
            <small className="text-zinc-500">
              Se a página não carregar, por favor atualize-a.
            </small>
          </div>
        ) : (
          rerender && (
            <iframe
              className="border-none h-[calc(100vh-210px)] w-full"
              src={`https://backoffice-suporte.vercel.app/#/solicitation?token=${token}&theme=${
                theme == "dark" ? "dark" : "light"
              }`}
            />
          )
        )}
      </div>
    </>
  );
}

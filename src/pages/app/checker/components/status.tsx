/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2 } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";

interface StatusCellProps {
  status: string;
  fileId: string;
  queryKey?: any[];
}

export function Status({ status, fileId, queryKey }: StatusCellProps) {
  const { progress } = useWebSocket(fileId, queryKey);

  const getStatusContent = (status: string, progress: number) => {
    switch (status) {
      case "completed":
        return {
          label: "Completo",
          color: "text-green-600 bg-green-100 dark:bg-transparent dark:border",
          icon: null,
        };
      case "processing":
        return {
          label: `${progress}%`,
          color: "text-blue-600 bg-blue-100 dark:bg-transparent dark:border",
          icon: <Loader2 className="w-3 h-3 animate-spin mr-1" />,
        };
      case "failed":
        return {
          label: "Erro",
          color: "text-red-600 bg-red-100 dark:bg-transparent dark:border",
          icon: null,
        };
      default:
        return {
          label: "Desconhecido",
          color: "text-gray-600 bg-gray-100 dark:bg-transparent dark:border",
          icon: null,
        };
    }
  };

  const statusContent = getStatusContent(status, progress);

  return (
    <p
      className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusContent.color}`}
    >
      {statusContent.icon}
      {statusContent.label}
    </p>
  );
}

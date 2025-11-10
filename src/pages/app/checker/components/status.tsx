/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2 } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useState, useEffect } from "react";

interface StatusCellProps {
  status: string;
  fileId: string;
  queryKey?: any[];
}

export function Status({ status, fileId, queryKey }: StatusCellProps) {
  const { progress } = useWebSocket(fileId, queryKey);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (status === "processing") {
      const startTime = Date.now();
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusContent = (status: string, progress: number) => {
    switch (status) {
      case "completed":
        return {
          label: "Completo",
          color: "text-[#8ac850] bg-[#e9ffd6] dark:bg-transparent dark:border",
          icon: null,
        };
      case "processing":
        return {
          label: `${progress}%`,
          color: "text-blue-600 bg-blue-100 dark:bg-transparent dark:border",
          icon: (
            <>
              <div className="animate-spin">
                <Loader2 className="w-3 h-3 animate-pulse mr-1" />
              </div>
            </>
          ),
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
    <div className="flex flex-col items-center gap-1">
      <p
        className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusContent.color}`}
      >
        {statusContent.icon}
        {statusContent.label}
      </p>
      {status === "processing" && elapsedTime > 0 && (
        <span className="text-[10px] text-muted-foreground ml-1">
          {formatTime(elapsedTime)}
        </span>
      )}
    </div>
  );
}

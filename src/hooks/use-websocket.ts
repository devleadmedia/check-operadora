/* eslint-disable @typescript-eslint/no-explicit-any */
import { websocketService } from "@/lib/websocket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export function useWebSocket(fileId: string, queryKey?: any[]) {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const processedRef = useRef(false);

  useEffect(() => {
    if (!fileId) return;

    processedRef.current = false;

    const unsubscribe = websocketService.subscribe(fileId, (message) => {
      if (message.data.file_id !== fileId) return;

      const { status } = message.data;

      if (status === "processing") {
        setProgress(50);
      }

      if (status === "completed" && !processedRef.current) {
        processedRef.current = true;
        setProgress(100);

        setTimeout(() => {
          if (queryKey) {
            queryClient.invalidateQueries({ queryKey });
          }
        }, 500);
      }

      if (status === "failed") {
        if (queryKey) {
          queryClient.invalidateQueries({ queryKey });
        }
      }
    });

    return unsubscribe;
  }, [fileId, queryClient, queryKey]);

  return { progress };
}

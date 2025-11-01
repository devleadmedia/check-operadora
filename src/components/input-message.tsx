import { CircleAlert } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageProps {
  message: string | undefined;
}

export function InputMessage({ message }: MessageProps) {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CircleAlert size={16} className="fill-red-400 stroke-white" />
          </TooltipTrigger>
          <TooltipContent className="bg-red-500">
            <p className="dark:text-white">{message}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

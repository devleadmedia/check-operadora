import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SubMenuItem {
  name: string;
  route: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavigationHoverCardProps {
  children: React.ReactNode;
  items: SubMenuItem[];
}

export function NavigationHoverCard({
  children,
  items,
}: NavigationHoverCardProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <HoverCard openDelay={100} closeDelay={300}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="max-w-max p-2" side="bottom" align="center">
        <div className="space-y-1">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                variant={location.pathname === item.route ? "link" : "ghost"}
                key={item.route}
                onClick={() => navigate(item.route)}
                className="w-full flex items-start justify-start gap-3 px-3 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <IconComponent size={16} className="flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </Button>
            );
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

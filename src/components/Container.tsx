import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("w-full px-4 md:px-8 py-4", className)}>
      {children}
    </div>
  );
}

export default Container;

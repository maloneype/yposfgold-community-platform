import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
  maxHeight?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, viewportClassName, maxHeight = "300px", ...props }, ref) => {
    return (
      <div 
        className={cn("relative overflow-hidden rounded-lg", className)} 
        ref={ref} 
        {...props}
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <div
          className={cn("h-full w-full overflow-auto", viewportClassName)}
          style={{ maxHeight }}
        >
          {children}
        </div>
        <ScrollBar />
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex touch-none select-none",
          orientation === "vertical"
            ? "h-full w-2.5 border-l border-l-transparent p-[1px] transition-colors hover:p-0"
            : "h-2.5 border-t border-t-transparent p-[1px] transition-colors hover:p-0",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="relative flex-1 rounded-full bg-primary opacity-30 hover:opacity-50" />
      </div>
    );
  }
);

ScrollBar.displayName = "ScrollBar"; 
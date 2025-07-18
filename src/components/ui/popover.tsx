import * as React from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({ 
  trigger, 
  children, 
  align = "center",
  className 
}) => {
  const [open, setOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getAlignmentClasses = () => {
    switch (align) {
      case "start":
        return "left-0";
      case "end":
        return "right-0";
      default:
        return "left-1/2 -translate-x-1/2";
    }
  };

  return (
    <div className={cn("relative inline-block", className)} ref={popoverRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-[#ccc] bg-white p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            getAlignmentClasses()
          )}
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const PopoverTrigger = ({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("cursor-pointer", className)} {...props}>{children}</div>;
};

export const PopoverContent = ({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}; 
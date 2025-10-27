import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "inline";
}

export function ErrorMessage({ 
  message, 
  className,
  showIcon = true,
  variant = "default"
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div 
      className={cn(
        variant === "default" 
          ? "p-3 rounded-md bg-red-50 border border-red-200 animate-in fade-in duration-300" 
          : "mt-1",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={cn(
        "flex items-center gap-2",
        variant === "default" ? "justify-center" : "justify-start"
      )}>
        {showIcon && (
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
        )}
        <p className={cn(
          "text-red-600 font-medium",
          variant === "default" ? "text-sm text-center" : "text-xs"
        )}>
          {message}
        </p>
      </div>
    </div>
  );
}
import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]";
    
    // ButcherBox-like distinct variants
    const variants = {
      primary: "bg-farm-green text-white hover:bg-farm-dark shadow-md hover:shadow-lg shadow-farm-green/20 focus:ring-farm-green",
      accent: "bg-farm-accent text-white hover:bg-orange-600 shadow-md hover:shadow-lg shadow-orange-500/20 focus:ring-farm-accent",
      secondary: "bg-white text-farm-dark border-2 border-farm-green/20 hover:border-farm-green hover:bg-farm-light/50 focus:ring-farm-green",
      ghost: "text-gray-600 hover:text-farm-dark hover:bg-black/5",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

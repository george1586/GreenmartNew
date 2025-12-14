import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
          ${hover ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-farm-green/20" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

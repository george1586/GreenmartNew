import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className = "", size = "lg", children, ...props }, ref) => {
        const sizes = {
            sm: "max-w-3xl",
            md: "max-w-5xl",
            lg: "max-w-7xl",
            xl: "max-w-[96rem]",
            full: "max-w-full",
        };

        return (
            <div
                ref={ref}
                className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Container.displayName = "Container";

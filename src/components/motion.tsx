// src/components/motion.tsx
import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export const Motion = motion;

export function FadeIn({
    children,
    delay = 0,
    y = 16,
    once = true,
}: PropsWithChildren<{ delay?: number; y?: number; once?: boolean }>) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}

export function Stagger({
    children,
    delay = 0,
    gap = 0.08,
    once = true,
}: PropsWithChildren<{ delay?: number; gap?: number; once?: boolean }>) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        delayChildren: delay,
                        staggerChildren: gap,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function ItemUp({ children }: PropsWithChildren) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            variants={
                reduce
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 18 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                    }
            }
        >
            {children}
        </motion.div>
    );
}

// Buton cu micro-interacțiuni (hover/press)
export function MotionButton(props: React.ComponentProps<typeof motion.button>) {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            {...props}
        />
    );
}

// Card cu „lift” pe hover
export function HoverCard({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
    return (
        <motion.div
            className={className}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
            {children}
        </motion.div>
    );
}

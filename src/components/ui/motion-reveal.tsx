"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type MotionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tempo?: "slow" | "base" | "fast";
};

export function MotionReveal({ children, className, delay = 0, tempo = "base" }: MotionRevealProps) {
  const duration = tempo === "slow" ? 0.8 : tempo === "fast" ? 0.45 : 0.6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerProps = {
  children: React.ReactNode;
  className?: string;
  tempo?: "slow" | "base" | "fast";
};

export function MotionStagger({ children, className, tempo = "base" }: MotionStaggerProps) {
  const staggerChildren = tempo === "slow" ? 0.14 : tempo === "fast" ? 0.08 : 0.11;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({ children, className, tempo = "base" }: MotionRevealProps) {
  const duration = tempo === "slow" ? 0.65 : tempo === "fast" ? 0.42 : 0.5;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

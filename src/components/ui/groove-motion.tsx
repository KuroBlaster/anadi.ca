"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type DriftSectionProps = {
  children: React.ReactNode;
  className?: string;
  intensity?: "soft" | "medium";
};

const BPM = 180;
const SECONDS_PER_BEAT = 60 / BPM;

function beats(count: number) {
  return SECONDS_PER_BEAT * count;
}

function motionLayerClassName() {
  return "pointer-events-none fixed inset-0 z-0 hidden overflow-hidden md:block";
}

export function DriftSection({ children, className, intensity = "soft" }: DriftSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const drift = intensity === "medium" ? [0, -4, 0] : [0, -2.5, 0];
  const duration = intensity === "medium" ? beats(16) : beats(24);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: drift }}
      transition={{ duration, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
    >
      {children}
    </motion.div>
  );
}

export function AmbientPulseLayer() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={motionLayerClassName()} aria-hidden>
        <div className="absolute left-[-13rem] top-[-9rem] h-[26rem] w-[26rem] rounded-full bg-accent-gold/7 blur-[120px]" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[23rem] w-[23rem] rounded-full bg-accent-blue/8 blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-[10%] h-[18rem] w-[18rem] rounded-full bg-accent-crimson/5 blur-[110px]" />
      </div>
    );
  }

  return (
    <div className={motionLayerClassName()} aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(circle at 10% 16%, rgba(63, 102, 180, 0.18), transparent 30%)",
            "radial-gradient(circle at 88% 12%, rgba(177, 147, 88, 0.16), transparent 28%)",
            "radial-gradient(circle at 16% 82%, rgba(95, 39, 50, 0.13), transparent 26%)",
            "radial-gradient(circle at 78% 76%, rgba(63, 102, 180, 0.1), transparent 28%)",
            "linear-gradient(180deg, rgba(255,255,255,0.008) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0.006) 100%)",
          ].join(", "),
        }}
        animate={{
          opacity: [0.28, 0.46, 0.34, 0.4, 0.28],
          x: ["-0.35%", "0.5%", "-0.15%", "0.22%", "-0.35%"],
          y: ["0%", "0.2%", "0.06%", "0.14%", "0%"],
          scale: [1, 1.014, 1.004, 1.01, 1],
        }}
        transition={{
          duration: beats(4),
          times: [0, 0.12, 0.26, 0.4, 1],
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <motion.div
        className="absolute inset-x-[-6%] top-[-2%] h-[42%]"
        style={{
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.7) 58%, rgba(0,0,0,0) 100%)",
          backgroundImage: "url('/signal-beat.svg')",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          mixBlendMode: "screen",
        }}
        animate={{
          opacity: [0.03, 0.08, 0.045, 0.065, 0.03],
          x: ["-0.45%", "0.6%", "-0.16%", "0.25%", "-0.45%"],
          scale: [1.002, 1.014, 1.004, 1.01, 1.002],
        }}
        transition={{
          duration: beats(4),
          delay: beats(0.08),
          times: [0, 0.1, 0.24, 0.38, 1],
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <motion.div
        className="absolute inset-x-[-7%] top-[-1%] h-[44%]"
        style={{
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.56) 56%, rgba(0,0,0,0) 100%)",
          backgroundImage: "url('/signal-chaos.svg')",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          mixBlendMode: "screen",
          filter: "blur(0.5px)",
        }}
        animate={{
          opacity: [0.02, 0.06, 0.03, 0.045, 0.02],
          x: ["0.3%", "-0.34%", "0.1%", "-0.14%", "0.3%"],
          y: ["0%", "0.18%", "0.05%", "0.1%", "0%"],
          scale: [1.004, 1.012, 1.005, 1.008, 1.004],
        }}
        transition={{
          duration: beats(4),
          delay: beats(0.18),
          times: [0, 0.1, 0.24, 0.38, 1],
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <motion.div
        className="absolute left-[-13rem] top-[-9rem] h-[26rem] w-[26rem] rounded-full bg-accent-gold/12 blur-[120px]"
        animate={{
          opacity: [0.12, 0.24, 0.15, 0.2, 0.12],
          scale: [1, 1.022, 1.006, 1.014, 1],
        }}
        transition={{
          duration: beats(4),
          times: [0, 0.12, 0.26, 0.4, 1],
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <motion.div
        className="absolute bottom-[-12rem] right-[-10rem] h-[23rem] w-[23rem] rounded-full bg-accent-blue/13 blur-[120px]"
        animate={{
          opacity: [0.14, 0.26, 0.17, 0.22, 0.14],
          scale: [1, 1.024, 1.008, 1.016, 1],
        }}
        transition={{
          duration: beats(4),
          delay: beats(0.25),
          times: [0, 0.12, 0.26, 0.4, 1],
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <motion.div
        className="absolute bottom-[-10rem] left-[10%] h-[18rem] w-[18rem] rounded-full bg-accent-crimson/9 blur-[110px]"
        animate={{
          opacity: [0.08, 0.16, 0.1, 0.13, 0.08],
          scale: [1, 1.02, 1.006, 1.012, 1],
        }}
        transition={{
          duration: beats(4),
          delay: beats(0.15),
          times: [0, 0.12, 0.26, 0.4, 1],
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
}

export function GrooveBand({ className }: { className?: string }) {
  return <div className={cn("groove-band", className)} aria-hidden />;
}

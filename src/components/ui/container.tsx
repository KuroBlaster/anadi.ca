import { cn } from "@/lib/cn";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export function Container({ className, children }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

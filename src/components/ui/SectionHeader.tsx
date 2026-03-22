import { cn } from "@/lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function SectionHeader({ children, className, ...props }: SectionHeaderProps) {
  return (
    <h2
      className={cn("text-indigo-950 text-xl font-medium leading-6", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

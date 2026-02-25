import type { CSSProperties, ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  gap?: string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  style?: CSSProperties;
  className?: string;
}

// Stack elements horizontally
export function HStack({ children, gap = "1rem", align = "center", justify, style, className }: StackProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "row", gap, alignItems: align, justifyContent: justify, ...style }}
    >
      {children}
    </div>
  );
}

// Stack elements vertically
export function VStack({ children, gap = "1rem", align, justify, style, className }: StackProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap, alignItems: align, justifyContent: justify, ...style }}
    >
      {children}
    </div>
  );
}

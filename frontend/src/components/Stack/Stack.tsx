import type { CSSProperties, ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  gap?: string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  style?: CSSProperties;
  className?: string;
  reverse?: boolean;
}

export function HStack({ children, gap = "1rem", align = "center", justify, style, className, reverse }: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "row",
        gap,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function VStack({ children, gap = "1rem", align, justify, style, className, reverse }: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: reverse ? "column-reverse" : "column",
        gap,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

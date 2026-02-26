import { type CSSProperties, type ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  minWidth?: string;
  gap?: string;
  style?: CSSProperties;
  className?: string;
}

export function Grid({ children, minWidth = "15rem", gap = "1rem", style }: GridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

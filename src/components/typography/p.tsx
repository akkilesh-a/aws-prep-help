import React, { ReactNode } from "react";

const P = ({
  children,
  className,
  variant = "default",
}: {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "small" | "large" | "muted";
}) => {
  return (
    <div
      className={`leading-7 ${variant == "large" && "text-lg font-semibold"} ${variant == "small" && "text-sm leading-none font-medium"} ${variant == "muted" && "text-muted-foreground text-sm"} ${className}`}
    >
      {children}
    </div>
  );
};

export default P;

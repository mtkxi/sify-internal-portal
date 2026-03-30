"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "#f0f9ff",
          "--success-text": "#0c4a6e",
          "--success-border": "#7dd3fc",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "var(--normal-bg)",
          color: "var(--normal-text)",
          border: "1px solid var(--normal-border)",
        },
        classNames: {
          success: "!bg-[--success-bg] !text-[--success-text] !border-[--success-border] font-medium",
          title: "!text-current font-semibold",
          description: "!text-current opacity-90",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

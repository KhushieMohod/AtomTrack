"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HiCheckCircle, HiInformationCircle, HiExclamationTriangle, HiXCircle } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <HiCheckCircle className="size-4" />
        ),
        info: (
          <HiInformationCircle className="size-4" />
        ),
        warning: (
          <HiExclamationTriangle className="size-4" />
        ),
        error: (
          <HiXCircle className="size-4" />
        ),
        loading: (
          <AiOutlineLoading3Quarters className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

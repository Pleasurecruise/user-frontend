"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class">
        <ToastProvider placement="top-center" toastOffset={60} />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

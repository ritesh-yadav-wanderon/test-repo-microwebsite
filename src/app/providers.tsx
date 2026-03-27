"use client";

import { AboutThemeProvider } from "@/components/about/Providers";
import { StyledComponentsRegistry } from "@/lib/registry";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <AboutThemeProvider>{children}</AboutThemeProvider>
    </StyledComponentsRegistry>
  );
}

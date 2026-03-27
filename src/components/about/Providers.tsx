"use client";

import { ThemeProvider } from "styled-components";
import { theme } from "@/theme/theme";

export function AboutThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

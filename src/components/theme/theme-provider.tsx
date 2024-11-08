// src/components/theme/theme-provider.tsx
"use client";

import { createContext, ReactNode, useContext } from "react";
import type { Theme } from "@/types";

interface ThemeContextType {
	theme: Theme | null;
	setTheme?: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: null });

export function ThemeProvider({ children }: { children: ReactNode }) {
	return <ThemeContext.Provider value={{ theme: null }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

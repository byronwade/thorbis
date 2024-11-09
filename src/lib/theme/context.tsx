"use client";
import { createContext, useContext } from "react";
import { SiteConfig } from "@prisma/client";

interface ThemeContextType {
	siteConfig: SiteConfig | null;
}

const ThemeContext = createContext<ThemeContextType>({
	siteConfig: null,
});

export function ThemeProvider({ children, siteConfig }: { children: React.ReactNode; siteConfig: SiteConfig | null }) {
	return <ThemeContext.Provider value={{ siteConfig }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	return useContext(ThemeContext);
}

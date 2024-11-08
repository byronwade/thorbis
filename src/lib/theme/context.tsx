"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeConfig } from "@/types";

type ThemeContextType = {
	currentTheme: ThemeConfig | null;
	isLoading: boolean;
	switchTheme: (themeId: string) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const loadActiveTheme = async () => {
		try {
			const response = await fetch("/api/themes/active");
			if (!response.ok) return null;
			return response.json();
		} catch (error) {
			console.error("Failed to load active theme:", error);
			return null;
		}
	};

	useEffect(() => {
		loadActiveTheme().then((theme) => {
			setCurrentTheme(theme);
			setIsLoading(false);
		});
	}, []);

	const switchTheme = async (themeId: string) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/themes/switch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ themeId }),
			});

			if (!response.ok) throw new Error("Failed to switch theme");

			const newTheme = await response.json();
			setCurrentTheme(newTheme);
		} finally {
			setIsLoading(false);
		}
	};

	return <ThemeContext.Provider value={{ currentTheme, isLoading, switchTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

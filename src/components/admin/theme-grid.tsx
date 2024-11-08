// src/components/admin/theme-grid.tsx
"use client";

import { useTheme } from "@/lib/theme/context";
import { Theme } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ThemeGrid({ themes }: { themes: Theme[] }) {
	const { currentTheme, switchTheme, isLoading } = useTheme();
	const { toast } = useToast();

	async function handleThemeSwitch(themeId: string) {
		try {
			await switchTheme(themeId);
			toast({
				title: "Theme switched",
				description: "The site will update with the new theme.",
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to switch theme",
				variant: "destructive",
			});
		}
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{themes.map((theme) => (
				<Card key={theme.id}>
					<CardHeader>
						<CardTitle>{theme.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-500">{theme.description}</p>
					</CardContent>
					<CardFooter>
						<Button variant={theme.id === currentTheme?.id ? "secondary" : "default"} disabled={isLoading || theme.id === currentTheme?.id} onClick={() => handleThemeSwitch(theme.id)} className="w-full">
							{theme.id === currentTheme?.id ? "Active" : "Activate"}
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

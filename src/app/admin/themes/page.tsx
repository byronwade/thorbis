// app/admin/themes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import type { ThemeMetadata } from "@/types";

export default function ThemesPage() {
	const [repoUrl, setRepoUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [themes, setThemes] = useState<ThemeMetadata[]>([]);
	const [checkingUpdates, setCheckingUpdates] = useState<Record<string, boolean>>({});
	const { toast } = useToast();

	useEffect(() => {
		fetchThemes();
	}, []);

	async function fetchThemes() {
		const res = await fetch("/api/themes");
		const data = await res.json();
		if (data.themes) {
			setThemes(data.themes);
		}
	}

	async function handleInstallTheme(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const res = await fetch("/api/themes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ repoUrl }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error);

			toast({
				title: "Theme installed",
				description: "Theme has been successfully installed",
			});

			setRepoUrl("");
			fetchThemes();
		} catch (error: unknown) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to install theme",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	async function handleActivateTheme(themeId: string) {
		try {
			const res = await fetch(`/api/themes/${themeId}/activate`, {
				method: "POST",
			});

			if (!res.ok) throw new Error("Failed to activate theme");

			toast({
				title: "Theme activated",
				description: "Theme will be applied on next reload",
			});

			fetchThemes();
		} catch (error: unknown) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to activate theme",
				variant: "destructive",
			});
		}
	}

	async function checkForUpdates(themeId: string) {
		try {
			setCheckingUpdates((prev) => ({ ...prev, [themeId]: true }));

			const res = await fetch(`/api/themes/${themeId}/check-update`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || data.details || "Failed to check for updates");
			}

			setThemes((prevThemes) =>
				prevThemes.map((theme) =>
					theme.id === themeId
						? {
								...theme,
								remoteVersion: data.remoteVersion,
								updateAvailable: data.needsUpdate,
						  }
						: theme
				)
			);

			if (!data.hasConfig) {
				toast({
					title: "Configuration Missing",
					description: data.details || "Theme configuration file not found",
					variant: "destructive",
				});
				return;
			}

			if (data.needsUpdate) {
				toast({
					title: "Update Available",
					description: `Version ${data.remoteVersion} is available (current: ${data.currentVersion})`,
					action: (
						<Button variant="outline" size="sm" onClick={() => handleUpdateTheme(themeId)}>
							Update Now
						</Button>
					),
				});
			} else {
				toast({
					title: "Theme Status",
					description: (
						<div className="space-y-2">
							<p>✓ Theme is up to date</p>
							<p className="text-sm text-gray-500">Current version: {data.currentVersion}</p>
							<p className="text-sm text-gray-500">Last checked: {new Date().toLocaleString()}</p>
						</div>
					),
					variant: "default",
					duration: 5000,
				});
			}
		} catch (error) {
			console.error("Check updates error:", error); // Debug log
			toast({
				title: "Error Checking Updates",
				description: error instanceof Error ? error.message : "Failed to check for updates",
				variant: "destructive",
			});
		} finally {
			setCheckingUpdates((prev) => ({ ...prev, [themeId]: false }));
		}
	}

	async function handleUpdateTheme(themeId: string) {
		try {
			setIsLoading(true);
			const res = await fetch(`/api/themes/${themeId}/update`, {
				method: "POST",
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to update theme");
			}

			toast({
				title: "Theme Updated",
				description: "Theme has been successfully updated",
			});

			fetchThemes();
		} catch (error) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to update theme",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Install New Theme</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleInstallTheme} className="space-y-4">
						<Input placeholder="GitHub Repository URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Installing..." : "Install Theme"}
						</Button>
					</form>
				</CardContent>
			</Card>
			<div className="space-y-6">
				{themes.map((theme) => (
					<Card key={theme.id}>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								{theme.name}
								{theme.active && <span className="text-sm font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center gap-x-2">
									<span className="text-sm text-gray-500">Version:</span>
									<div className="flex items-center gap-x-2">
										<span className="font-medium">{theme.version}</span>
										{checkingUpdates[theme.id] ? <span className="text-sm text-gray-500">(checking...)</span> : theme.remoteVersion ? theme.updateAvailable ? <span className="text-sm text-amber-600">(Update available: {theme.remoteVersion})</span> : <span className="text-sm text-green-600">(Up to date)</span> : <span className="text-sm text-gray-500">(Click check for updates)</span>}
									</div>
								</div>
								{theme.updateAvailable && (
									<Alert className="mt-4">
										<AlertTitle>Update Available</AlertTitle>
										<AlertDescription>Version {theme.remoteVersion} is available</AlertDescription>
									</Alert>
								)}
							</div>
						</CardContent>
						<CardFooter className="space-x-2">
							<Button onClick={() => checkForUpdates(theme.id)} disabled={checkingUpdates[theme.id]}>
								{checkingUpdates[theme.id] ? (
									<>
										<span className="mr-2">Checking...</span>
										<span className="animate-spin">⟳</span>
									</>
								) : (
									"Check for Updates"
								)}
							</Button>
							{theme.updateAvailable && (
								<Button variant="outline" onClick={() => handleUpdateTheme(theme.id)}>
									Update Theme
								</Button>
							)}
							{!theme.active && (
								<Button variant="secondary" onClick={() => handleActivateTheme(theme.id)}>
									Activate
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}

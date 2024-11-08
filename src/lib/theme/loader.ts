// src/lib/theme/loader.ts
import type { Theme, ThemeConfig } from "@/types";

export class ThemeLoader {
	async loadTheme(repository: string, branch = "main"): Promise<Theme> {
		console.log("1. ThemeLoader.loadTheme called with:", { repository, branch });

		const token = process.env.GITHUB_TOKEN;
		if (!token) {
			console.error("2. GITHUB_TOKEN not configured");
			throw new Error("GITHUB_TOKEN is not configured");
		}

		// Test GitHub token
		try {
			const testResponse = await fetch("https://api.github.com/user", {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/vnd.github.v3+json",
				},
			});

			if (!testResponse.ok) {
				console.error("GitHub token validation failed:", await testResponse.text());
				throw new Error("Invalid GitHub token");
			}
			console.log("GitHub token validated successfully");
		} catch (error) {
			console.error("GitHub token validation error:", error);
			throw error;
		}

		const [owner, repo] = repository.split("/");
		console.log("3. Parsed repository:", { owner, repo });

		if (!owner || !repo) {
			console.error("4. Invalid repository format");
			throw new Error("Invalid repository format. Expected 'owner/repo'");
		}

		try {
			const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/theme.json`;
			console.log("5. Fetching theme from:", url);

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/vnd.github.v3.raw",
				},
				next: { revalidate: 0 }, // Disable cache during debugging
			});

			console.log("6. Fetch response status:", response.status);

			if (!response.ok) {
				const error = await response.text();
				console.error("7. GitHub API Error Response:", error);
				throw new Error(`GitHub API error: ${error}`);
			}

			const config = await response.json();
			console.log("8. Theme config loaded:", config);

			return {
				id: `${repository}@${branch}`,
				name: config.name,
				repository,
				branch,
				version: config.version,
				components: config.components,
				active: false,
			};
		} catch (error) {
			console.error("9. Theme loading error:", error);
			throw error;
		}
	}
}

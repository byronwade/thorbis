// src/lib/theme/loader.ts
import type { Theme, ThemeConfig } from "@/types";

export class ThemeLoader {
	private validateComponentPath(path: string | undefined): boolean {
		if (!path) return false;

		const validExtensions = [".tsx", ".jsx", ".js"];
		const validPaths = ["components/", "layouts/"];

		return validExtensions.some((ext) => path.endsWith(ext)) && validPaths.some((prefix) => path.startsWith(prefix));
	}

	private async transformComponent(content: string): Promise<string> {
		// Remove any existing export statements
		const cleanContent = content.replace(/export\s+default\s+/g, "return ");

		// Wrap the component in a function to make it evaluatable
		return `
			function createComponent(props) {
				${cleanContent}
			}
		`;
	}

	async loadComponent(repository: string, branch: string, path: string): Promise<string> {
		if (!this.validateComponentPath(path)) {
			throw new Error("Invalid component path");
		}

		const token = process.env.GITHUB_TOKEN;
		if (!token) {
			throw new Error("GITHUB_TOKEN is not configured");
		}

		const [owner, repo] = repository.split("/");
		if (!owner || !repo) {
			throw new Error("Invalid repository format");
		}

		const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
		console.log("Fetching component from:", url);

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github.v3.raw",
			},
			next: { revalidate: 3600 },
		});

		if (!response.ok) {
			throw new Error(`Failed to load component: ${await response.text()}`);
		}

		const content = await response.text();
		return this.transformComponent(content);
	}

	private async loadThemeConfig(owner: string, repo: string, branch: string): Promise<ThemeConfig> {
		const token = process.env.GITHUB_TOKEN;
		const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/theme.json`;

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github.v3.raw",
			},
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		if (!response.ok) {
			throw new Error(`Failed to load theme config: ${await response.text()}`);
		}

		return response.json();
	}

	private async bundleComponents(components: Record<string, ThemeComponent>): Promise<Record<string, string>> {
		const bundled: Record<string, string> = {};

		for (const [key, component] of Object.entries(components)) {
			try {
				// Ensure component path is properly formatted
				const componentPath = component.path.startsWith("/") ? component.path.slice(1) : component.path;

				const code = await this.loadComponent(
					component.repository || "", // Add fallback
					component.branch || "main", // Add fallback
					componentPath
				);
				bundled[key] = code;
			} catch (error) {
				console.error(`Failed to bundle component ${key}:`, error);
				throw error;
			}
		}

		return bundled;
	}

	async loadTheme(repository: string, branch = "main"): Promise<Theme> {
		console.log("Loading theme:", { repository, branch });

		const [owner, repo] = repository.split("/");
		if (!owner || !repo) throw new Error("Invalid repository format");

		try {
			const themeConfig = await this.loadThemeConfig(owner, repo, branch);
			console.log("Theme config loaded:", themeConfig);

			const bundledComponents = await this.bundleComponents(themeConfig.components);
			console.log("Components bundled successfully");

			return {
				id: `${repository}@${branch}`,
				name: themeConfig.name,
				repository,
				branch,
				version: themeConfig.version,
				components: bundledComponents,
				active: false,
			};
		} catch (error) {
			console.error("Failed to load theme:", error);
			throw error;
		}
	}
}

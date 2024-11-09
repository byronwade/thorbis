import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { ThemeConfig } from "tailwindcss/types/config";

export class ThemeManager {
	initializeDefaultTheme() {
		throw new Error("Method not implemented.");
	}
	private themesDir: string;
	private tempDir: string;

	constructor() {
		// Set paths relative to src/app/themes
		this.themesDir = path.join(process.cwd(), "src", "app", "themes");
		this.tempDir = path.join(process.cwd(), ".temp-theme");
	}

	async updateTheme(repository: string, branch: string): Promise<void> {
		try {
			// Create temp directory for cloning
			await fs.ensureDir(this.tempDir);

			console.log(`Cloning ${repository}#${branch} to temp directory...`);
			execSync(`git clone --depth 1 --branch ${branch} https://github.com/${repository}.git ${this.tempDir}`, {
				stdio: "inherit",
			});

			// Define source and target directories
			const activeThemeDir = path.join(this.themesDir, "active");

			// Ensure themes directory exists
			await fs.ensureDir(activeThemeDir);

			// List of files to copy
			const filesToCopy = ["theme.json", "package.json", "app.tsx", "components", "layout"];

			// Remove old theme files
			console.log("Removing old theme files...");
			for (const file of filesToCopy) {
				const targetPath = path.join(activeThemeDir, file);
				await fs.remove(targetPath);
			}

			// Copy new theme files
			console.log("Installing new theme files...");
			for (const file of filesToCopy) {
				const sourcePath = path.join(this.tempDir, file);
				const targetPath = path.join(activeThemeDir, file);

				if (await fs.pathExists(sourcePath)) {
					await fs.copy(sourcePath, targetPath);
				}
			}

			console.log(`Theme updated successfully at ${activeThemeDir}`);
		} catch (error) {
			console.error("Failed to update theme:", error);
			throw new Error(`Failed to update theme: ${error instanceof Error ? error.message : "Unknown error"}`);
		} finally {
			// Clean up temp directory
			if (await fs.pathExists(this.tempDir)) {
				await fs.remove(this.tempDir);
			}
		}
	}

	async getThemeConfig(themeName: string): Promise<ThemeConfig> {
		const configPath = path.join(this.themesDir, themeName, "theme.json");
		try {
			const configData = await fs.readFile(configPath, "utf-8");
			return JSON.parse(configData);
		} catch (error) {
			throw new Error(`Failed to read theme config: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
}

import { cache } from "react";
import { prisma } from "../db";

class ThorbisSDK {
	private baseUrl: string;

	constructor() {
		// Get the base URL from environment or default to localhost in development
		this.baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
	}

	private getFullUrl(path: string): string {
		// If path starts with http/https, it's already a full URL
		if (path.startsWith("http")) {
			return path;
		}
		// Ensure path starts with /
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;
		return `${this.baseUrl}${normalizedPath}`;
	}

	async getSiteConfig() {
		try {
			const response = await fetch(this.getFullUrl("/api/site-config"));
			if (!response.ok) {
				throw new Error("Failed to fetch site config");
			}
			return await response.json();
		} catch (error) {
			console.error("Error fetching site config:", error);
			return null;
		}
	}

	getActiveTheme = cache(async () => {
		return prisma.theme.findFirst({
			where: { active: true },
			include: {
				siteConfig: true,
			},
		});
	});
}

// Export a singleton instance
export const thorbis = new ThorbisSDK();

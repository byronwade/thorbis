import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { ThemeManager } from "@/lib/theme/manager";

export async function POST(request: Request, context: { params: { id: string } }) {
	const newParams = await context.params;
	try {
		const themeId = newParams.id;
		console.log("Updating theme:", themeId);

		const theme = await prisma.theme.findUnique({
			where: { id: themeId },
		});

		if (!theme) {
			return NextResponse.json({ error: "Theme not found" }, { status: 404 });
		}

		// Initialize theme manager and download new files
		const themeManager = new ThemeManager();
		await themeManager.updateTheme(theme.repository, theme.branch);

		// Fetch and update theme version from theme.json
		const rawUrl = `https://raw.githubusercontent.com/${theme.repository}/${theme.branch}/theme.json`;
		const response = await fetch(rawUrl);

		if (!response.ok) {
			return NextResponse.json({ error: "Failed to fetch theme config" }, { status: 404 });
		}

		const config = await response.json();

		// Update theme metadata in database
		const updatedTheme = await prisma.theme.update({
			where: { id: themeId },
			data: {
				version: config.version,
				remoteVersion: config.version,
				updateAvailable: false,
			},
		});

		// Trigger Vercel redeploy if in production
		if (process.env.VERCEL && process.env.VERCEL_DEPLOY_HOOK) {
			await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: "POST" });
			console.log("Triggered Vercel redeploy");
		}

		return NextResponse.json({ theme: updatedTheme });
	} catch (error) {
		console.error("Update error:", error);
		return NextResponse.json({ error: "Failed to update theme", details: (error as Error).message }, { status: 500 });
	}
}

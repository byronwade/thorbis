import { NextResponse } from "next/server";
import { getActiveTheme } from "@/lib/db/queries";
import { ThemeLoader } from "@/lib/theme/loader";

export async function GET(request: Request, context: { params: { path: string[] } }) {
	try {
		const componentPath = context.params.path.join("/");
		console.log("Loading component:", componentPath);

		const activeTheme = await getActiveTheme();
		if (!activeTheme) {
			return NextResponse.json({ error: "No active theme" }, { status: 404 });
		}

		const themeLoader = new ThemeLoader();
		const componentContent = await themeLoader.loadComponent(activeTheme.repository, activeTheme.branch, componentPath);

		// Transform the component content to be browser-compatible
		const transformedContent = `
			"use client";
			const Component = (${componentContent});
			export default Component;
		`;

		return new NextResponse(transformedContent, {
			headers: {
				"Content-Type": "application/javascript",
				"Cache-Control": "public, max-age=3600",
			},
		});
	} catch (error) {
		console.error("Component loading error:", error);
		return NextResponse.json({ error: "Failed to load component" }, { status: 500 });
	}
}

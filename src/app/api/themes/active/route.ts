import { NextResponse } from "next/server";
import { thorbis } from "@/lib/sdk/thorbis";
import fs from "fs-extra";
import path from "path";

export async function GET() {
	try {
		const theme = await thorbis.getActiveTheme();
		if (!theme) {
			return NextResponse.json({ error: "No active theme found" }, { status: 404 });
		}

		// Get theme name from repository
		const themeName = theme.repository.split("/")[1];

		// Read theme.json to get component configuration
		const themeConfigPath = path.join(process.cwd(), "src", "app", "themes", themeName, "theme.json");
		const themeConfig = await fs.readJSON(themeConfigPath);

		// Dynamically build component paths based on theme.json
		const components = Object.entries(themeConfig.components).reduce<Record<string, string>>((acc, [key]) => {
			acc[key] = `@/themes/${themeName}/components/${key}`;
			return acc;
		}, {});

		return NextResponse.json({
			theme: {
				...theme,
				components,
				layouts: Object.entries(themeConfig.layouts).reduce<Record<string, string>>((acc, [key]) => {
					acc[key] = `@/themes/${themeName}/layouts/${key}`;
					return acc;
				}, {}),
			},
		});
	} catch (error) {
		console.error("Active theme error:", error);
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}

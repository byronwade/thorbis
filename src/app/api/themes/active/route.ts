import { NextResponse } from "next/server";
import { getActiveTheme } from "@/lib/db/queries";
import { ThemeLoader } from "@/lib/theme/loader";

export async function GET() {
	try {
		console.log("1. Fetching active theme from database...");
		const activeTheme = await getActiveTheme();
		console.log("2. Active theme from DB:", activeTheme);

		if (!activeTheme) {
			console.log("3. No active theme found in database");
			return NextResponse.json({ error: "No active theme found" }, { status: 404 });
		}

		console.log("4. Creating theme loader...");
		const themeLoader = new ThemeLoader();
		console.log("5. Loading theme from repository:", activeTheme.repository);
		const theme = await themeLoader.loadTheme(activeTheme.repository, activeTheme.branch);
		console.log("6. Theme loaded successfully:", theme);

		return NextResponse.json(theme);
	} catch (error) {
		console.error("7. Error in active theme route:", error);
		return NextResponse.json({ error: "Failed to load active theme", details: error.message }, { status: 500 });
	}
}

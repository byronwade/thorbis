import { NextResponse } from "next/server";
import { getActiveTheme } from "@/lib/db/queries";
import { ThemeLoader } from "@/lib/theme/loader";

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
	try {
		const activeTheme = await getActiveTheme();
		if (!activeTheme) {
			return NextResponse.json({ error: "No active theme" }, { status: 404 });
		}

		const componentPath = (await params.path).join("/");
		console.log("Loading component:", componentPath);

		const themeLoader = new ThemeLoader();
		const theme = await themeLoader.loadTheme(activeTheme.repository, activeTheme.branch);

		// Fetch the component content from GitHub
		const response = await fetch(`https://raw.githubusercontent.com/${activeTheme.repository}/${activeTheme.branch}/${componentPath}`, {
			headers: {
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			},
			next: { revalidate: 3600 },
		});

		if (!response.ok) {
			return NextResponse.json({ error: "Component not found" }, { status: 404 });
		}

		const content = await response.text();
		return new NextResponse(content, {
			headers: { "Content-Type": "application/javascript" },
		});
	} catch (error) {
		console.error("Component loading error:", error);
		return NextResponse.json({ error: "Failed to load component" }, { status: 500 });
	}
}

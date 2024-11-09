import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
	try {
		const themeId = await context.params.id;
		console.log("Checking updates for theme:", themeId);

		const theme = await prisma.theme.findUnique({
			where: { id: themeId },
		});

		if (!theme) {
			console.error("Theme not found:", themeId);
			return NextResponse.json({ error: "Theme not found", details: `No theme with ID: ${themeId}` }, { status: 404 });
		}

		const rawUrl = `https://raw.githubusercontent.com/${theme.repository}/${theme.branch}/theme.json`;
		console.log("Fetching config from:", rawUrl);

		const response = await fetch(rawUrl);
		if (!response.ok) {
			console.error("Failed to fetch theme config:", response.status, await response.text());
			return NextResponse.json({ error: "Theme config not found", details: `Failed to fetch from ${rawUrl}` }, { status: 404 });
		}

		const config = await response.json();
		console.log("Remote config:", config);

		const remoteVersion = config.version;
		const needsUpdate = remoteVersion !== theme.version;

		await prisma.theme.update({
			where: { id: themeId },
			data: {
				remoteVersion,
				updateAvailable: needsUpdate,
			},
		});

		return NextResponse.json({
			currentVersion: theme.version,
			remoteVersion,
			needsUpdate,
			hasConfig: true,
		});
	} catch (error) {
		console.error("Check update error:", error);
		return NextResponse.json({ error: "Failed to check for updates", details: (error as Error).message }, { status: 500 });
	}
}

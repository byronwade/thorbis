import { NextResponse } from "next/server";
import { activateTheme } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
	try {
		const { themeId } = await request.json();

		// Activate the new theme
		await activateTheme(themeId);

		// Revalidate all pages
		revalidatePath("/", "layout");

		return NextResponse.json({ success: true });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json({ error: "Failed to switch theme" }, { status: 500 });
	}
}

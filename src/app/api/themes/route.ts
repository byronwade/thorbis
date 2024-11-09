import { themeQueries } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const themes = await themeQueries.getAll();
		return NextResponse.json({ themes });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 });
	}
}

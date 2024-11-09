import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const config = await prisma.siteConfig.findFirst({
			where: { id: "default" },
		});
		return NextResponse.json(config);
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch site config" }, { status: 500 });
	}
}

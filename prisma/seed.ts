// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Starting seed...");

	// Delete existing themes
	await prisma.theme.deleteMany();
	console.log("Cleared existing themes");

	// Create default theme with correct repository
	const theme = await prisma.theme.create({
		data: {
			id: "default-theme@main",
			name: "Thorbis Default Theme",
			repository: "byronwade/thorbis-default-theme",
			branch: "main",
			version: "1.0.0",
			active: true,
		},
	});

	console.log("Created theme:", theme);
}

main()
	.catch((e) => {
		console.error("Seed error:", e);
		process.exit(1);
	})
	.finally(async () => {
		console.log("Seed completed");
		await prisma.$disconnect();
	});

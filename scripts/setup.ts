import { PrismaClient } from "@prisma/client";
import { ThemeManager } from "../src/lib/theme/manager";

async function setup() {
	const prisma = new PrismaClient();
	const themeManager = new ThemeManager();

	try {
		await prisma.$connect();
		console.log("Initializing default theme...");
		await themeManager.initializeDefaultTheme();
		console.log("Setup completed successfully");
	} catch (error) {
		console.error("Setup failed:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

setup();

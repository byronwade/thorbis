import { prisma } from "../db";

// Theme queries
export async function getThemes() {
	return prisma.theme.findMany({
		orderBy: { createdAt: "desc" },
	});
}

export async function getActiveTheme() {
	return prisma.theme.findFirst({
		where: { active: true },
	});
}

export async function activateTheme(id: string) {
	await prisma.theme.updateMany({
		where: { active: true },
		data: { active: false },
	});

	return prisma.theme.update({
		where: { id },
		data: { active: true },
	});
}

// Site config queries
export async function getSiteConfig() {
	return prisma.siteConfig.findFirst({
		where: { id: "default" },
	});
}

export async function updateSiteConfig(data: { name?: string; description?: string }) {
	return prisma.siteConfig.update({
		where: { id: "default" },
		data,
	});
}

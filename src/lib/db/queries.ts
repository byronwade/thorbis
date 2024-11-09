import { prisma } from "@/lib/db";
import { ThemeMetadata, SiteConfig } from "@/types";

// Theme queries
export const themeQueries = {
	getAll: async (): Promise<ThemeMetadata[]> => {
		const themes = await prisma.theme.findMany({ orderBy: { createdAt: "desc" } });
		return themes.map((theme) => ({
			...theme,
			remoteVersion: theme.remoteVersion ?? undefined,
		}));
	},

	getActive: async (): Promise<ThemeMetadata | null> => {
		const theme = await prisma.theme.findFirst({ where: { active: true } });
		if (!theme) return null;
		return {
			...theme,
			remoteVersion: theme.remoteVersion ?? undefined,
		};
	},

	activate: async (themeId: string): Promise<void> => {
		await prisma.theme.updateMany({
			where: { active: true },
			data: { active: false },
		});
		await prisma.theme.update({
			where: { id: themeId },
			data: { active: true },
		});
	},

	update: async (themeId: string, data: Partial<ThemeMetadata>): Promise<ThemeMetadata> => {
		const updated = await prisma.theme.update({
			where: { id: themeId },
			data,
		});
		return {
			...updated,
			remoteVersion: updated.remoteVersion ?? undefined,
		};
	},
};

// Site config queries
export const configQueries = {
	get: async () =>
		prisma.siteConfig.findFirst({
			where: { id: "default" },
			include: { theme: true },
		}),

	update: async (data: Partial<SiteConfig>) =>
		prisma.siteConfig.update({
			where: { id: "default" },
			data,
			include: { theme: true },
		}),
};

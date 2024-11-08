// src/types/index.ts
export interface Theme {
	id: string;
	name: string;
	description?: string;
	repository: string;
	branch: string;
	version: string;
	active: boolean;
}

export interface SiteConfig {
	id: string;
	name: string;
	description?: string;
	activeThemeId?: string;
}

export interface ThemeConfig {
	name: string;
	description?: string;
	version: string;
}

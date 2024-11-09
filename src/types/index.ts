// src/types/index.ts
export interface SiteConfig {
	id: string;
	name: string;
	description?: string;
}

export interface ThemeMetadata {
	id: string;
	name: string;
	version: string;
	repository: string;
	active: boolean;
	createdAt: Date;
	remoteVersion?: string;
	updateAvailable?: boolean;
}

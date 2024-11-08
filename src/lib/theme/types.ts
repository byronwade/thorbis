// src/lib/theme/types.ts
export interface ThemeComponent {
	id: string;
	name: string;
	path: string;
}

export interface ThemeConfig {
	name: string;
	version: string;
	description?: string;
	components: Record<string, ThemeComponent>;
	layouts?: Record<string, ThemeComponent>;
	dependencies?: Record<string, string>;
}

// src/lib/theme/types.ts
export interface ThemeComponent {
	id: string;
	name: string;
	component: React.ComponentType<unknown>;
}

export interface ThemeConfig {
	name: string;
	version: string;
	components: Record<string, ThemeComponent>;
	dependencies?: Record<string, string>;
}

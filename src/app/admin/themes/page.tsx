// src/app/admin/themes/page.tsx
import { ThemeGrid } from "@/components/admin/theme-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getThemes } from "@/lib/db/queries";

export default async function ThemesPage() {
	const themes = await getThemes();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Themes</h1>
				<Button>
					<Plus className="w-4 h-4 mr-2" />
					Add Theme
				</Button>
			</div>

			<ThemeGrid themes={themes} />
		</div>
	);
}

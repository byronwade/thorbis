// src/app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { themeQueries } from "@/lib/db/queries";

export default async function AdminDashboard() {
	const [themes, activeTheme] = await Promise.all([themeQueries.getAll(), themeQueries.getActive()]);

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Dashboard</h1>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Active Theme</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{activeTheme?.name ?? "None"}</p>
						{activeTheme && <p className="text-sm text-gray-500">Version: {activeTheme.version}</p>}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Installed Themes</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{themes.length}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

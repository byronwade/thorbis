// src/app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
	const themeCount = await prisma.theme.count();
	const activeTheme = await prisma.theme.findFirst({
		where: { active: true },
	});

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
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Installed Themes</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{themeCount}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

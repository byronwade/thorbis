// src/app/admin/settings/page.tsx
import { SiteSettingsForm } from "@/components/admin/site-settings-config";
import { configQueries, themeQueries } from "@/lib/db/queries";

export default async function SettingsPage() {
	const [siteConfig, activeTheme] = await Promise.all([configQueries.get(), themeQueries.getActive()]);

	return (
		<div className="max-w-2xl space-y-6">
			<h1 className="text-3xl font-bold">Site Settings</h1>
			{/* @ts-expect-error Server Component */}
			<SiteSettingsForm initialData={siteConfig} activeTheme={activeTheme} />
		</div>
	);
}

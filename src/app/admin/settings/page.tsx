// src/app/admin/settings/page.tsx
import { SiteSettingsForm } from "@/components/admin/site-settings-config";
import { getSiteConfig } from "@/lib/db/queries";

export default async function SettingsPage() {
	const siteConfig = await getSiteConfig();

	return (
		<div className="max-w-2xl space-y-6">
			<h1 className="text-3xl font-bold">Site Settings</h1>
			<SiteSettingsForm initialData={siteConfig} />
		</div>
	);
}

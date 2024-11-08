// src/app/admin/layout.tsx
import { SideNav } from "@/components/admin/side-nav";
import { TopNav } from "@/components/admin/top-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-100">
			<TopNav />
			<div className="flex">
				<SideNav />
				<main className="flex-1 p-8">{children}</main>
			</div>
		</div>
	);
}

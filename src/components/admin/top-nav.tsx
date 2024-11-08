// src/components/admin/top-nav.tsx
import { Button } from "@/components/ui/button";

export function TopNav() {
	return (
		<header className="h-16 border-b bg-white">
			<div className="flex items-center justify-between h-full px-6">
				<div className="font-semibold text-xl">Thorbis Admin</div>
				<Button variant="outline" size="sm">
					View Site
				</Button>
			</div>
		</header>
	);
}

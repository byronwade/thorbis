// src/components/admin/side-nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Palette, Settings } from "lucide-react";

const links = [
	{
		name: "Dashboard",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		name: "Themes",
		href: "/admin/themes",
		icon: Palette,
	},
	{
		name: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
];

export function SideNav() {
	const pathname = usePathname();

	return (
		<nav className="w-64 min-h-screen bg-white border-r">
			<div className="flex flex-col gap-2 p-4">
				{links.map((link) => (
					<Link key={link.href} href={link.href} className={cn("flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100", pathname === link.href && "bg-gray-100")}>
						<link.icon className="w-5 h-5" />
						{link.name}
					</Link>
				))}
			</div>
		</nav>
	);
}

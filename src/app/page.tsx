"use client";
import { useTheme } from "@/lib/theme/context";
import { Suspense, lazy } from "react";

export default function Home() {
	const { currentTheme, isLoading } = useTheme();

	if (isLoading) {
		return <div>Loading theme...</div>;
	}

	if (!currentTheme) {
		return <div>No active theme found</div>;
	}

	// Load component through API
	const Hero = lazy(() =>
		fetch(`/api/themes/components/components/Hero.tsx`)
			.then((res) => res.text())
			.then((code) => {
				// Create a module from the component code
				const module = new Function("React", `return ${code}`)(React);
				return { default: module };
			})
	);

	return (
		<div className="min-h-screen">
			<Suspense fallback={<div>Loading hero component...</div>}>
				<Hero />
			</Suspense>
		</div>
	);
}

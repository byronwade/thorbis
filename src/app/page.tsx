import { Suspense } from "react";
import dynamic from "next/dynamic";

const App = dynamic(() => import("@/app/themes/active/app"), {
	loading: () => <div className="animate-pulse bg-gray-200 h-40" />,
	ssr: true,
});

export default function Home() {
	return (
		<div>
			<Suspense fallback={<div className="animate-pulse bg-gray-200 h-40" />}>
				<App />
			</Suspense>
		</div>
	);
}

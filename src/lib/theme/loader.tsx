import dynamic from "next/dynamic";
import React from "react";

export function getThemeComponent(componentName: string) {
	return dynamic(() => import(`@/app/themes/active/components/${componentName}`), {
		loading: () => <div className="animate-pulse bg-gray-200 h-40" />,
		ssr: true,
	});
}

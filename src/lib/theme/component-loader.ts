import { createEdgeFunction } from "@vercel/edge";

export class ComponentLoader {
	async loadComponent(componentCode: string) {
		// Create an edge function to evaluate the component
		const edge = await createEdgeFunction({
			code: componentCode,
			runtime: "edge",
			regions: ["iad1"], // Deploy to specific edge regions
		});

		return edge;
	}

	async evaluateComponent(componentCode: string, props: any) {
		const component = await this.loadComponent(componentCode);
		return component.invoke({ props });
	}
}

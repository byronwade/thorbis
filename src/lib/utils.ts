// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseGithubUrl(url: string): { owner: string; repo: string } {
	const [_, owner, repo] = url.split("/");
	return { owner, repo };
}

export function validateThemeUrl(url: string): boolean {
	const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
	return githubUrlPattern.test(url);
}

import { nanoid } from "nanoid";

export function createSlug(name: string): string {
	const unifiedString =
		name.trim().toLowerCase().split(" ").join("-") + nanoid(3);
	return unifiedString;
}

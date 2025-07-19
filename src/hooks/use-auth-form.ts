/** biome-ignore-all lint/suspicious/noExplicitAny: <Disable any because of ZodType flexibility> */
import type { ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useAuthForm<T extends Record<string, any>>(
	schema: ZodType<T, any>,
) {
	const methods = useForm<T>({
		resolver: zodResolver(schema),
	});

	return methods;
}

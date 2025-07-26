"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function workspaceCreation() {}

export async function billingPortal() {
	const { url } = await auth.api.portal({
		headers: await headers(),
	});

	window.location.href = url;
}

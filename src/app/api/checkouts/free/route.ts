import type { NextRequest } from "next/server";
import { redirect, RedirectType } from "next/navigation";
import { auth } from "@/lib/auth";
import { createSlug } from "@/lib/create-slug";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const organizationName = searchParams.get("orgName");

	const userSession = await auth.api.getSession({
		headers: request.headers,
	});

	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 402 });
	}

	if (!organizationName) {
		return Response.json(
			{ error: "No organization name provided" },
			{ status: 500 },
		);
	}

	await auth.api.createOrganization({
		body: {
			name: organizationName.split("_").join(" "),
			slug: createSlug(organizationName),
			userId: userSession.user.id,
		},
		headers: await headers(),
	});

	redirect("/workspace?welcome=true", RedirectType.replace);
}

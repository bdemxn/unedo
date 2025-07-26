import { billing } from "@/database/schemas";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { dodopayments } from "@/lib/payments";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const status = searchParams.get("status");
	const subscriptionId = searchParams.get("subscription_id");

	if (status !== "active" || !subscriptionId) {
		return Response.json(
			{ issue: "Problems with subscriptions" },
			{ status: 500 },
		);
	}

	const subscription =
		await dodopayments.subscriptions.retrieve(subscriptionId);

	if (!subscription) {
		return Response.json(
			{ issue: "Problems with subscriptions" },
			{ status: 500 },
		);
	}

	const session = await auth.api.getSession({ headers: await headers() });

	if (!session || !session.session.activeOrganizationId) {
		return Response.json({ issue: "Unauthorized" }, { status: 402 });
	}

	await db.insert(billing).values({
		orgId: session.session.activeOrganizationId,
		subscriptionId: subscription.product_id,
	});

	redirect("/workspace");
}

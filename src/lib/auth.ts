import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import {
	dodopayments,
	checkout,
	portal,
	webhooks,
} from "@dodopayments/better-auth";
import { ac, admin, member, owner } from "./roles";
import { dodopayments as paymentClient } from "./payments";
import { db } from "./db";
import { env } from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 * 60,
		},
	},

	emailAndPassword: {
		enabled: true,
	},

	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},

	plugins: [
		organization({
			ac,
			roles: {
				admin,
				member,
				owner,
			},
		}),
		dodopayments({
			client: paymentClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [
						{
							productId: "pdt_Sfgjfw3Vw23DSAD6WZiyx",
							slug: "basic-plan",
						},
					],
					authenticatedUsersOnly: true,
					successUrl: "/api/checkouts",
				}),
				portal(),
				webhooks({
					webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
					onPayload: async (payload) => {
						console.log("Received webhook:", payload.event_type);
					},
				}),
			],
		}),
	],
});

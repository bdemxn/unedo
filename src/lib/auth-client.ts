import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { dodopaymentsClient } from "@dodopayments/better-auth";
import { ac, admin, member, owner } from "./roles";

export const authClient = createAuthClient({
	plugins: [
		organizationClient({
			ac,
			roles: {
				admin,
				member,
				owner,
			},
		}),
		dodopaymentsClient(),
	],
});

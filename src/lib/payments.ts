import DodoPayments from "dodopayments";
import { env } from "./env";

export const dodopayments = new DodoPayments({
	bearerToken: env.DODO_PAYMENTS_API_KEY,
	environment: "test_mode",
});

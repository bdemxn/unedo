export const env = {
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
	DATABASE_URL: process.env.DATABASE_URL as string,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
	RESEND: process.env.RESEND as string,
	DODO_PAYMENTS_API_KEY: process.env.DODO_PAYMENTS_API_KEY as string,
	DODO_PAYMENTS_WEBHOOK_SECRET: process.env
		.DODO_PAYMENTS_WEBHOOK_SECRET as string,
	DODO_PAYMENTS_MODE: process.env.DODO_PAYMENTS_MODE as string,
};

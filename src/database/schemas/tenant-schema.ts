import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organization } from "./auth-schema";

export const billing = pgTable("billing", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid(6)),
	orgId: text("org_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	subscriptionId: text("subscription_id").notNull(),
	plan: text("plan", { enum: ["free", "basic", "pro", "enterprise"] })
		.notNull()
		.default("free"),
	period: text("period", { enum: ["monthly", "yearly"] })
		.notNull()
		.default("monthly"),
	createdAt: timestamp("created_at").defaultNow(),
	updateAt: timestamp("updated_at").defaultNow(),
});

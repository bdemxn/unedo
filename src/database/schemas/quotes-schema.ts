import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organization } from "./auth-schema";

export const quote = pgTable("quotes", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid(10)),
	orgId: text("org_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	products: jsonb("products").notNull(),
	customerName: text("customer_name").notNull(),
	email: text("email").notNull(),
	status: text("status", { enum: ["pending", "accepted", "rejected"] })
		.notNull()
		.default("pending"),
	createdAt: timestamp("created_at").defaultNow(),
});

import {
	doublePrecision,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { member, organization } from "./auth-schema";

export const invoice = pgTable("invoices", {
	id: uuid("id").primaryKey().defaultRandom(),
	orgId: text("org_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	memberId: text("member_id")
		.notNull()
		.references(() => member.id),
	products: jsonb("products").notNull(),
	totalPaid: doublePrecision("total_paid").notNull(),
	currencyPaid: varchar("currency_paid", { length: 5 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

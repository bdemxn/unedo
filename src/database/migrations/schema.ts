import {
	pgTable,
	text,
	timestamp,
	unique,
	boolean,
	foreignKey,
	serial,
	uuid,
	integer,
	doublePrecision,
	varchar,
	jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const user = pgTable(
	"user",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		email: text().notNull(),
		emailVerified: boolean("email_verified").notNull(),
		image: text(),
		createdAt: timestamp("created_at", { mode: "string" }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
	},
	(table) => [unique("user_email_unique").on(table.email)],
);

export const account = pgTable(
	"account",
	{
		id: text().primaryKey().notNull(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id").notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", {
			mode: "string",
		}),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
			mode: "string",
		}),
		scope: text(),
		password: text(),
		createdAt: timestamp("created_at", { mode: "string" }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const organization = pgTable(
	"organization",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		slug: text(),
		logo: text(),
		createdAt: timestamp("created_at", { mode: "string" }).notNull(),
		metadata: text(),
	},
	(table) => [unique("organization_slug_unique").on(table.slug)],
);

export const invitation = pgTable(
	"invitation",
	{
		id: text().primaryKey().notNull(),
		organizationId: text("organization_id").notNull(),
		email: text().notNull(),
		role: text(),
		status: text().default("pending").notNull(),
		expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
		inviterId: text("inviter_id").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "invitation_organization_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.inviterId],
			foreignColumns: [user.id],
			name: "invitation_inviter_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const member = pgTable(
	"member",
	{
		id: text().primaryKey().notNull(),
		organizationId: text("organization_id").notNull(),
		userId: text("user_id").notNull(),
		role: text().default("member").notNull(),
		createdAt: timestamp("created_at", { mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "member_organization_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "member_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const session = pgTable(
	"session",
	{
		id: text().primaryKey().notNull(),
		expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
		token: text().notNull(),
		createdAt: timestamp("created_at", { mode: "string" }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id").notNull(),
		activeOrganizationId: text("active_organization_id"),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk",
		}).onDelete("cascade"),
		unique("session_token_unique").on(table.token),
	],
);

export const inventoryMovements = pgTable(
	"inventory_movements",
	{
		id: serial().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		memberId: text("member_id").notNull(),
		originId: uuid("origin_id").notNull(),
		destinationId: uuid("destination_id").notNull(),
		reason: text().notNull(),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "inventory_movements_org_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.memberId],
			foreignColumns: [member.id],
			name: "inventory_movements_member_id_member_id_fk",
		}),
		foreignKey({
			columns: [table.originId],
			foreignColumns: [warehouses.id],
			name: "inventory_movements_origin_id_warehouses_id_fk",
		}),
		foreignKey({
			columns: [table.destinationId],
			foreignColumns: [warehouses.id],
			name: "inventory_movements_destination_id_warehouses_id_fk",
		}),
	],
);

export const warehouses = pgTable(
	"warehouses",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		name: text().notNull(),
		address: text(),
		phoneNumber: text("phone_number"),
		isDisabled: boolean("is_disabled").default(false),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "warehouses_org_id_organization_id_fk",
		}).onDelete("cascade"),
	],
);

export const products = pgTable(
	"products",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		warehouseId: uuid("warehouse_id").notNull(),
		name: text().notNull(),
		quantity: integer().notNull(),
		price: doublePrecision().notNull(),
		currency: varchar({ length: 5 }),
		isDisabled: boolean("is_disabled").default(false),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.warehouseId],
			foreignColumns: [warehouses.id],
			name: "products_warehouse_id_warehouses_id_fk",
		}).onDelete("cascade"),
	],
);

export const services = pgTable(
	"services",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		title: text().notNull(),
		description: text(),
		price: doublePrecision().notNull(),
		currency: varchar({ length: 5 }),
		isDisabled: boolean("is_disabled").default(false),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "services_org_id_organization_id_fk",
		}).onDelete("cascade"),
	],
);

export const invoices = pgTable(
	"invoices",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		memberId: text("member_id").notNull(),
		products: jsonb().notNull(),
		totalPaid: doublePrecision("total_paid").notNull(),
		currencyPaid: varchar("currency_paid", { length: 5 }).notNull(),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "invoices_org_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.memberId],
			foreignColumns: [member.id],
			name: "invoices_member_id_member_id_fk",
		}),
	],
);

export const quotes = pgTable(
	"quotes",
	{
		id: text().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		products: jsonb().notNull(),
		customerName: text("customer_name").notNull(),
		email: text().notNull(),
		status: text().default("pending").notNull(),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "quotes_org_id_organization_id_fk",
		}).onDelete("cascade"),
	],
);

export const billing = pgTable(
	"billing",
	{
		id: text().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		plan: text().default("free").notNull(),
		period: text().default("monthly").notNull(),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "billing_org_id_organization_id_fk",
		}).onDelete("cascade"),
	],
);

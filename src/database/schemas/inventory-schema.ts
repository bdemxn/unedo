import {
	boolean,
	doublePrecision,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { member, organization } from "./auth-schema";

export const product = pgTable("products", {
	id: uuid("id").primaryKey().defaultRandom(),
	warehouseId: uuid("warehouse_id")
		.notNull()
		.references(() => warehouse.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	quantity: integer("quantity").notNull(),
	price: doublePrecision("price").notNull(),
	currency: varchar("currency", { length: 5 }),
	isDisabled: boolean("is_disabled").default(false),
	createdAt: timestamp("created_at").defaultNow(),
	updateAt: timestamp("updated_at").defaultNow(),
});

export const service = pgTable("services", {
	id: uuid("id").primaryKey().defaultRandom(),
	orgId: text("org_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	price: doublePrecision("price").notNull(),
	currency: varchar("currency", { length: 5 }),
	isDisabled: boolean("is_disabled").default(false),
	createdAt: timestamp("created_at").defaultNow(),
	updateAt: timestamp("updated_at").defaultNow(),
});

export const warehouse = pgTable("warehouses", {
	id: uuid("id").primaryKey().defaultRandom(),
	orgId: text("org_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	address: text("address"),
	phoneNumber: text("phone_number"),
	isDisabled: boolean("is_disabled").default(false),
	createdAt: timestamp("created_at").defaultNow(),
	updateAt: timestamp("updated_at").defaultNow(),
});

export const inventoryMovement = pgTable("inventory_movements", {
	id: serial("id").primaryKey(),
	orgId: text("org_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	memberId: text("member_id")
		.notNull()
		.references(() => member.id),
	originId: uuid("origin_id")
		.notNull()
		.references(() => warehouse.id),
	destinationId: uuid("destination_id")
		.notNull()
		.references(() => warehouse.id),
	reason: text("reason").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

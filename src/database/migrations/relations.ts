import { relations } from "drizzle-orm/relations";
import {
	user,
	account,
	organization,
	invitation,
	member,
	session,
	inventoryMovements,
	warehouses,
	products,
	services,
	invoices,
	quotes,
	billing,
} from "./schema";

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const userRelations = relations(user, ({ many }) => ({
	accounts: many(account),
	invitations: many(invitation),
	members: many(member),
	sessions: many(session),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	invitations: many(invitation),
	members: many(member),
	inventoryMovements: many(inventoryMovements),
	warehouses: many(warehouses),
	services: many(services),
	invoices: many(invoices),
	quotes: many(quotes),
	billings: many(billing),
}));

export const memberRelations = relations(member, ({ one, many }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
	inventoryMovements: many(inventoryMovements),
	invoices: many(invoices),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const inventoryMovementsRelations = relations(
	inventoryMovements,
	({ one }) => ({
		organization: one(organization, {
			fields: [inventoryMovements.orgId],
			references: [organization.id],
		}),
		member: one(member, {
			fields: [inventoryMovements.memberId],
			references: [member.id],
		}),
		warehouse_originId: one(warehouses, {
			fields: [inventoryMovements.originId],
			references: [warehouses.id],
			relationName: "inventoryMovements_originId_warehouses_id",
		}),
		warehouse_destinationId: one(warehouses, {
			fields: [inventoryMovements.destinationId],
			references: [warehouses.id],
			relationName: "inventoryMovements_destinationId_warehouses_id",
		}),
	}),
);

export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
	inventoryMovements_originId: many(inventoryMovements, {
		relationName: "inventoryMovements_originId_warehouses_id",
	}),
	inventoryMovements_destinationId: many(inventoryMovements, {
		relationName: "inventoryMovements_destinationId_warehouses_id",
	}),
	organization: one(organization, {
		fields: [warehouses.orgId],
		references: [organization.id],
	}),
	products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
	warehouse: one(warehouses, {
		fields: [products.warehouseId],
		references: [warehouses.id],
	}),
}));

export const servicesRelations = relations(services, ({ one }) => ({
	organization: one(organization, {
		fields: [services.orgId],
		references: [organization.id],
	}),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
	organization: one(organization, {
		fields: [invoices.orgId],
		references: [organization.id],
	}),
	member: one(member, {
		fields: [invoices.memberId],
		references: [member.id],
	}),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
	organization: one(organization, {
		fields: [quotes.orgId],
		references: [organization.id],
	}),
}));

export const billingRelations = relations(billing, ({ one }) => ({
	organization: one(organization, {
		fields: [billing.orgId],
		references: [organization.id],
	}),
}));

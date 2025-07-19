import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  ownerAc,
  memberAc,
} from "better-auth/plugins/organization/access";

const statements = {
  ...defaultStatements,
  inventory: ["create", "update", "delete"],
  quotes: ["create", "update", "delete"],
  billing: ["upgrade", "cancel"],
  suppliers: ["create", "update", "delete"],
  sales: ["create", "delete"],
} as const;

const ac = createAccessControl(statements);

const owner = ac.newRole({
  ...ownerAc.statements,
  inventory: ["create", "update", "delete"],
  quotes: ["create", "update", "delete"],
  billing: ["upgrade", "cancel"],
  suppliers: ["create", "update", "delete"],
  sales: ["create", "delete"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  inventory: ["create", "update", "delete"],
  quotes: ["create", "update", "delete"],
  suppliers: ["create", "update", "delete"],
  sales: ["create", "delete"],
});

const member = ac.newRole({
  ...memberAc.statements,
  inventory: ["create"],
  quotes: ["create"],
  sales: ["create"],
});

export { ac, owner, admin, member };

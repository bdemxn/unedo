import { authClient } from "./auth-client";

const canCreateInventory = authClient.organization.checkRolePermission({
	permissions: {
		inventory: ["create"],
	},
	role: "member",
});

export { canCreateInventory };

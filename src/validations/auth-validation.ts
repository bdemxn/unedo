import z from "zod";

export const loginSchema = z.object({
	email: z.email({ error: "Correo no válido" }),
	password: z
		.string()
		.min(8, "La contraseña debe de ser mayor a 8 dígitos")
		.max(36, "La contraseña no debe de pasar los 36 dígitos"),
});

export const registerSchema = loginSchema
	.extend({
		fullname: z.string().min(4, "Nombre muy corto"),
		confirmPassword: z
			.string({ error: "Confirma tu contraseña" })
			.min(8, "La contraseña debe de ser mayor a 8 dígitos"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

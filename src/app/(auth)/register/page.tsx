"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "@/hooks/use-auth-form";
import { authClient } from "@/lib/auth-client";
import { registerSchema } from "@/validations/auth-validation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type z from "zod";

export default function RegisterPage() {
	return (
		<Card className="font-sans w-full max-w-xl my-auto mx-auto">
			<CardHeader>
				<CardTitle className="text-center">Registrate en Unedo</CardTitle>
				<CardDescription className="text-center">
					Crea tu cuenta con nosotros y ten tu inventario al dia y 100%
					modernizado.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<RegisterForm />
			</CardContent>
		</Card>
	);
}

export function RegisterForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useAuthForm(registerSchema);

	const router = useRouter();

	const onSubmit = (values: z.infer<typeof registerSchema>) => {
		toast.promise(
			async () => {
				const { data, error } = await authClient.signUp.email({
					email: values.email,
					name: values.fullname,
					password: values.password,
				});

				if (error) throw error;
				return data;
			},
			{
				loading: "Iniciando sesión...",
				success: (data) => {
					router.push("/workspace?create=new");
					return `Bienvenido ${data.user.name}, disfruta de la experiencia Unedo`;
				},
				error: (error) => `Ups, ha habido un error: ${error.message}`,
			},
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
			<div className="space-y-1">
				<Label htmlFor="fullname">Tu nombre</Label>
				<Input id="fullname" type="text" {...register("fullname")} />
				{errors.fullname && (
					<span className="text-xs text-red-500">
						{errors.fullname.message}
					</span>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="email">Correo electrónico</Label>
				<Input id="email" type="email" {...register("email")} />
				{errors.email && (
					<span className="text-xs text-red-500">{errors.email.message}</span>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="password">Contraseña</Label>
				<Input id="password" type="password" {...register("password")} />
				{errors.password && (
					<span className="text-xs text-red-500">
						{errors.password.message}
					</span>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="confirmPassword">Confirma tu contraseña</Label>
				<Input
					id="confirmPassword"
					type="password"
					{...register("confirmPassword")}
				/>
				{errors.confirmPassword && (
					<span className="text-xs text-red-500">
						{errors.confirmPassword.message}
					</span>
				)}
			</div>

			<Button>Registrarme</Button>

			<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
				<span className="bg-background text-muted-foreground relative z-10 px-2">
					Ó tambien puedes
				</span>
			</div>

			<Button
				type="button"
				variant="outline"
				onClick={async () =>
					await authClient.signIn.social({ provider: "google" })
				}
			>
				<Image
					src="/google.svg"
					alt="Google login for Unedo"
					width={15}
					height={15}
				/>
				Continuar con Google
			</Button>

			<Link href="/login" className="text-right text-sm hover:underline">
				¿Ya usas Unedo?
			</Link>
		</form>
	);
}

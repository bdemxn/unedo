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
import { loginSchema } from "@/validations/auth-validation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import type z from "zod";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	return (
		<Card className="font-sans w-full max-w-xl my-auto mx-auto">
			<CardHeader>
				<CardTitle className="text-center">
					Inicia sesión a tu cuenta Unedo
				</CardTitle>
				<CardDescription className="text-center">
					Digita tus credenciales para poder ingresar a tu panel de
					administración.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<LoginForm />
			</CardContent>
		</Card>
	);
}

export function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useAuthForm(loginSchema);

	const router = useRouter();

	const onSubmit = (values: z.infer<typeof loginSchema>) => {
		toast.promise(
			async () => {
				const { data, error } = await authClient.signIn.email({
					email: values.email,
					password: values.password,
				});

				if (error) throw error;
				return data;
			},
			{
				loading: "Iniciando sesión...",
				success: (data) => {
					router.push("/workspace");
					return `Bienvenido ${data.user.name}`;
				},
				error: (error) => `Ups, ha habido un error: ${error.message}`,
			},
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
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

			<Button>Iniciar</Button>

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

			<Link href="/register" className="text-right text-sm hover:underline">
				¿Aún no tienes una cuenta con nosotros?
			</Link>
		</form>
	);
}

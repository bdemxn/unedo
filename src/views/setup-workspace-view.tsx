"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { workspaceSubscriptionSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

export function SetupWorkspaceView() {
	return (
		<section className="w-screen h-screen flex">
			<section className="mx-auto my-auto">
				<header className="text-center">
					<h1 className="font-sans text-lg">Te damos la bienvenida a Unedo</h1>
					<h2 className="font-sans text-neutral-500">
						Digitaliza tu negocio y simplifica tu gestión.
					</h2>
				</header>

				<SetupWorkspaceTab />
			</section>
		</section>
	);
}

export function SetupWorkspaceTab() {
	const { data: useSession } = authClient.useSession();
	const {
		register,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(workspaceSubscriptionSchema),
	});

	function createCheckout(input: z.infer<typeof workspaceSubscriptionSchema>) {
		const { plan } = input;

		if (plan === "free")
			redirect(
				`/api/checkouts/free?orgName=${input.organizationName.split(" ").join("_")}`,
			);

		toast.promise(
			async () => {
				await authClient.checkout({
					slug: plan,
					customer: {
						email: useSession?.user.email,
						name: useSession?.user.name,
					},
					billing: {
						city: "San Francisco",
						country: "US",
						state: "CA",
						street: "123 Market St",
						zipcode: "94103",
					},
					referenceId: nanoid(6),
					product_id: plan,
					// "pdt_Sfgjfw3Vw23DSAD6WZiyx"
				});
			},
			{
				loading: "Creando enlace de pago...",
				success: "Redireccionamiento completado",
			},
		);
	}

	const pricing = [
		{
			slug: "free",
			name: "Gratis",
			badge: "0$",
			description: "Ventas, inventario básico y cotizaciones por correo.",
		},
		{
			slug: "basic-plan",
			name: "Básico",
			badge: "11.99$",
			description:
				"Todo lo del plan Gratis más gestión de servicios y bodegas múltiples.",
		},
		{
			slug: "pro-plan",
			name: "Profesional",
			badge: "49.99$",
			description:
				"Todo lo anterior más movimiento entre bodegas, estadísticas avanzadas y soporte prioritario.",
		},
	];

	const selectedPlan = watch("plan");
	const selectedPricing = pricing.find((p) => p.slug === selectedPlan);

	return (
		<form
			onSubmit={handleSubmit(createCheckout)}
			className="flex flex-col gap-y-1 font-sans mt-4"
		>
			<div>
				<Input placeholder="Taller Bonilla" {...register("organizationName")} />
				{errors.organizationName && (
					<span className="text-xs text-red-500">
						{errors.organizationName.message}
					</span>
				)}
			</div>

			<Controller
				control={control}
				name="plan"
				render={({ field }) => (
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<SelectTrigger className="md:min-w-sm">
							<SelectValue placeholder="Selecciona un plan de trabajo" />
						</SelectTrigger>

						<SelectContent>
							{pricing.map((pr) => (
								<SelectItem
									value={pr.slug}
									key={pr.slug}
									className="flex items-center"
								>
									{pr.name}
									<Badge variant="outline" className="ml-auto">
										{pr.badge}
									</Badge>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>

			{selectedPlan && (
				<div className="mt-2 text-sm text-gray-600 text-center md:max-w-sm">
					{selectedPricing?.description}
				</div>
			)}

			<Button className="mt-4">Crea tu espacio de trabajo</Button>
		</form>
	);
}

"use client";

import { SetupWorkspaceView } from "@/views/setup-workspace-view";
import { useSearchParams } from "next/navigation";
import { geistMono, geistSans } from "@/lib/fonts";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";

export default function WorkspaceLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const searchParams = useSearchParams();
	const showSetup: boolean = searchParams.get("create") === "new";

	if (showSetup) return <SetupWorkspaceView />;

	return (
		<SidebarProvider
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
			<AppSidebar />
			<SidebarInset>
				<main className="p-2">
					<SidebarTrigger />
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

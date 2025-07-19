"use client";

import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { geistMono, geistSans } from "@/lib/fonts";

const logError = (error: Error, info: React.ErrorInfo) => {
	console.log(`Error: ${error}: ${info}`);
};

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
	resetErrorBoundary();

	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre className="text-xs text-red-500">{error.message}</pre>
		</div>
	);
}

export default function AuthLayout({
	children,
}: Readonly<React.PropsWithChildren>) {
	return (
		<ErrorBoundary onError={logError} fallbackRender={Fallback}>
			<main
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen`}
			>
				{children}
			</main>
		</ErrorBoundary>
	);
}

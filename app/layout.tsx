import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/app/components/nav-bar";
import "./globals.css";
import { Suspense } from "react";
import { LoadingSpinner } from "./components/loading-spinner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Explain the Word",
	description: "Describe vocabulary words and get an AI score out of 100",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				<Suspense fallback={<LoadingSpinner/>}>
					<NavBar />
				</Suspense>
				<main className="flex flex-1 flex-col">{children}</main>
			</body>
		</html>
	);
}

// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavHeader } from "./components/NavHeader";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import Footer from "@/app/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "GROW App",
	description: "GROW Community Church's Web Application ",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className={`${inter.className} flex flex-col min-h-screen`}>
					<NavHeader>{children}</NavHeader>
					<Footer />
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}

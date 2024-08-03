"use client";

import { useAuth } from "./components/AuthProvider";

export default function Home() {
	const { isAuthenticated, login, logout } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	return (
		<>
			<main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<section className="sticky w-full">
					<div className="max-w-lg px-4 pt-24 mx-auto  md:max-w-none text-center">
						<h1 className="font-extrabold leading-tight tracking-tight text-[#201515] sm:leading-none text-3xl sm:text-6xl">
							<span className="block md:inline">Welcome to </span>
							<span className="relative mt-2 bg-clip-text text-[#201515] md:inline-block">
								GROW.
							</span>
						</h1>
						{isAuthenticated && userData && (
							<div className="mt-4 text-center">
								<p className="text-lg">Hello, {userData.name}!</p>
							</div>
						)}
					</div>
				</section>
			</main>
		</>
	);
}

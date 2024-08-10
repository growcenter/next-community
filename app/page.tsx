"use client";

import { useAuth } from "./components/AuthProvider";
import EventsAdmin from "./dashboard/page";

export default function Home() {
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	return (
		<>
			{isAuthenticated && userData.role === "usher" ? (
				<EventsAdmin />
			) : (
				<main className="flex items-center justify-center min-h-screen bg-gray-100">
					<section className="w-full">
						<div className="flex flex-col items-center justify-center h-full max-w-lg px-4 mx-auto text-center md:max-w-none">
							<h1 className="font-extrabold leading-tight tracking-tight text-[#201515] sm:leading-none text-2xl sm:text-6xl">
								<span className="block md:inline">Welcome to </span>
								<span className="relative mt-2 bg-clip-text text-[#201515] md:inline-block">
									GROW.
								</span>
							</h1>
							{isAuthenticated && userData && (
								<div className="mt-3 text-center">
									<p className="text-lg font-bold">Shalom, {userData.name}!</p>
									<div className="mt-4 text-base text-center sm:text-base leading-relaxed text-gray-700">
										<p className="mt-1">
											<span className="font-bold">Session 1:</span>
											<br /> Registered seats will be open until 8:40. Seats
											will be open to all at 8:40.
										</p>
										<p className="mt-1">
											<span className="font-bold">Session 2:</span>
											<br /> Registered seats will be open until 10:40. Seats
											will be open to all at 10:40.
										</p>
										<p className="mt-1">
											<span className="font-bold">Session 3:</span>
											<br /> Registered seats will be open until 13:10. Seats
											will be open to all at 13:10.
										</p>
									</div>
								</div>
							)}
						</div>
					</section>
				</main>
			)}
		</>
	);
}

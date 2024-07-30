"use client";

import { useAuth } from "../components/authProvider";

export default function Home() {
	const { isAuthenticated, login, logout } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	return (
		<>
			<main>
				<section className='sticky'>
					<div className='max-w-lg px-4 pt-24 mx-auto text-left md:max-w-none md:text-center'>
						<h1 className='font-extrabold leading-5 tracking-tight text-[#201515] sm:leading-none text-3xl sm:text-8xl'>
							<span className='inline md:block'>Welcome to </span>
							<span className='relative mt-2 bg-clip-text text-[#201515] md:inline-block'>
								GROW.
							</span>
						</h1>
						{isAuthenticated && userData && (
							<div>
								<p>Name: {userData.name}</p>
								<p>Email: {userData.email}</p>
								<p>Phone: {userData.phoneNumber}</p>
								<p>Token: {userData.token}</p>
								<p>Role: {userData.role}</p>
								{/* Add other user data as needed */}
							</div>
						)}
					</div>
				</section>
			</main>
		</>
	);
}

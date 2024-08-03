"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { signInSchema } from "../../lib/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";

export default function LogIn() {
	const router = useRouter();
	const { login } = useAuth();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
	});

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		setErrorMessage(null); // Reset error message

		try {
			const response = await fetch(
				"http://localhost:8080/api/v1/event/user/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
					},
					body: JSON.stringify(values),
				}
			);
			if (response.ok) {
				const result = await response.json();
				login(result);
				router.push("/");
			} else {
				const errorResult = await response.json();
				console.log(errorResult);
				if (errorResult.status === "DATA_NOT_FOUND") {
					setErrorMessage(
						"User not found. Please register / check your email or phone number."
					);
				} else if (errorResult.status === "INVALID_CREDENTIALS") {
					setErrorMessage("Invalid password. Please try again!");
				} else {
					setErrorMessage("Failed to log in. Please try again.");
				}
			}
		} catch (error) {
			setErrorMessage("An error occurred. Please try again.");
			console.error("An error occurred:", error);
		}
	}

	const handleGoogleSignIn = () => {
		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
		window.location.href = googleAuthUrl;
	};

	return (
		<>
			<h1 className="text-3xl md:text-5xl text-center font-extrabold mx-4 mt-8">
				Log In
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full max-w-md p-6 mx-auto mt-8 border rounded-lg shadow-md bg-white"
				>
					{errorMessage && (
						<div className="mb-4 text-red-500 text-center">{errorMessage}</div>
					)}
					<FormField
						control={form.control}
						name="identifier"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Enter your email / phone number</FormLabel>
								<FormControl>
									<Input placeholder="example@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type={showPassword ? "text" : "password"} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex items-center mb-4">
						<input
							id="showPassword"
							type="checkbox"
							checked={showPassword}
							onChange={() => setShowPassword(!showPassword)}
							className="mr-2"
						/>
						<label htmlFor="showPassword">Show Password</label>
					</div>
					<Button className="w-full py-2" type="submit">
						Submit
					</Button>
				</form>
			</Form>
			<div className="text-center mt-4">
				<Button
					variant="outline"
					onClick={handleGoogleSignIn}
					className="w-1/2 py-2"
				>
					Sign in with Google
				</Button>
			</div>
		</>
	);
}

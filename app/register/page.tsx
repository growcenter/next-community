"use client";
import { userSchema } from "@/lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/app/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/app/components/ui/input";

export default function Register() {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			phoneNumber: "",
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof userSchema>) {
		setErrorMessage(null); // Reset error message

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/event/user/register`,
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

				router.push("/login");
			} else {
				const errorResult = await response.json();

				if (errorResult.status === "ALREADY_EXISTS") {
					setErrorMessage(
						"User with your email/phone number already exists. Please log in!"
					);
				} else {
					setErrorMessage("Failed to register user. Please try again.");
				}
				console.error("Failed to register user:", response.statusText);
			}
		} catch (error) {
			setErrorMessage("An error occurred. Please try again.");
			console.error("An error occurred:", error);
		}
	}

	return (
		<>
			<h1 className="text-3xl md:text-5xl text-center font-extrabold mx-4 mt-8">
				Register
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full max-w-md p-6 mx-auto mt-8 border rounded-lg shadow-md bg-white"
				>
					<Label className="text-sm  text-center text-red-500 font-style : italic">
						*Please input at least an email or phone number (or both)
					</Label>
					{errorMessage && (
						<div className="mb-4 text-red-500 text-center">{errorMessage}</div>
					)}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input placeholder="John Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="example@gmail.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input
										type="tel"
										{...field}
										placeholder="Please input this format: 081234567890"
									/>
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
		</>
	);
}

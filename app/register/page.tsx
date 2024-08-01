"use client";
import { userSchema } from "@/lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
				"http://localhost:8080/api/v1/event/user/register",
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
				console.log("User registered successfully:", result);
				router.push("/login");
			} else {
				const errorResult = await response.json();
				console.log(errorResult);
				if (errorResult.status === "ALREADY_EXISTS") {
					setErrorMessage("User with your email/phone number already exists. Please log in!");
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
			<h1 className='text-5xl text-center font-extrabold mx-auto mt-8'>
				Register
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='w-1/2 p-10 mx-auto mt-8 border'
				>
					{errorMessage && (
						<div className='mb-4 text-red-500 text-center'>
							{errorMessage}
						</div>
					)}
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input placeholder='John Doe' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder='agyasta1808@gmail.com' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='phoneNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input type='tel' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type={showPassword ? 'text' : 'password'} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex items-center">
						<input
							id="showPassword"
							type="checkbox"
							checked={showPassword}
							onChange={() => setShowPassword(!showPassword)}
							className="mr-2"
						/>
						<label htmlFor="showPassword">Show Password</label>
					</div>
					<Button className='mt-4' type='submit'>
						Submit
					</Button>
				</form>
			</Form>
		</>
	);
}

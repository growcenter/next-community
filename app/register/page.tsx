"use client";
import { userSchema } from "@/lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
	// 1. Define your form.
	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			phoneNumber: "",
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof userSchema>) {
		try {
			const response = await fetch(
				"http://localhost:8080/api/v1/event/user/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-API-Key": "gc2024",
					},
					body: JSON.stringify(values),
				}
			);

			if (response.ok) {
				const result = await response.json();
				console.log("User registered successfully:", result);
				router.push("/login");
			} else {
				console.log(values);
				console.error("Failed to register user:", response.statusText);
			}
		} catch (error) {
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
									<Input type='password' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className='mt-4' type='submit'>
						Submit
					</Button>
				</form>
			</Form>
		</>
	);
}

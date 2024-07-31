"use client";
import { signInSchema } from "@/lib/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/authProvider";
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

export default function LogIn() {
	const router = useRouter();
	const { login } = useAuth();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
	});

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		try {
			const response = await fetch(
				"http://localhost:8080/api/v1/event/user/login",
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
				console.log("User Signed in successfully:", result);
				login(result);
				router.push("/");
			} else {
				console.error("Failed to Log In user:", response.statusText);
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
	}
	return (
		<>
			<h1 className='text-5xl text-center font-extrabold mx-auto mt-8'>
				Log In
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='w-1/2 p-10 mx-auto mt-8 border'
				>
					<FormField
						control={form.control}
						name='identifier'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Enter your email / phone number</FormLabel>
								<FormControl>
									<Input placeholder='John Doe' {...field} />
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

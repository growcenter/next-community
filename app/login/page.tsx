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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "../components/ui/dialog";

export default function LogIn() {
	const router = useRouter();
	const { login } = useAuth();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [identifier, setIdentifier] = useState("");
	const [password, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false); // Added loading state for forgot password

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
	});

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		setErrorMessage(null); // Reset error message
		setLoading(true); // Disable the button
		values.identifier = values.identifier
			.trim()
			.replace(/\s+/g, "")
			.toLowerCase();
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/event/user/login`,
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
		} finally {
			setLoading(false);
		}
	}

	const handleGoogleSignIn = () => {
		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
		window.location.href = googleAuthUrl;
	};

	const handleResetPassword = async () => {
		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		setForgotPasswordLoading(true); // Start loading

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/event/user/forgot`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						"X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
					},
					body: JSON.stringify({ identifier, password }),
				}
			);
			if (response.ok) {
				alert("Password reset successfully");
				setIsDialogOpen(false);
				router.push("/"); // Redirect to the main page
			} else {
				const errorResult = await response.json();
				alert("Failed to reset password: " + errorResult.message);
			}
		} catch (error) {
			alert("An error occurred. Please try again.");
			console.error("An error occurred:", error);
		} finally {
			setForgotPasswordLoading(false); // Stop loading
		}
	};

	return (
		<>
			<h1 className="text-3xl md:text-5xl text-center font-extrabold mx-4 mt-8">
				Log In
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full md:w-1/2 p-24 md:p-24 mx-auto my-5 text-sm border rounded-lg shadow-md bg-white"
				>
					{errorMessage && (
						<div className="mb-4 text-red-500 text-center">{errorMessage}</div>
					)}
					<FormField
						control={form.control}
						name="identifier"
						render={({ field }) => (
							<FormItem className="text-xs md:text-base">
								<FormLabel>Enter your email or phone number</FormLabel>
								<FormControl>
									<Input
										placeholder="example@example.com or 081234567890"
										{...field}
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
							className="mt-3"
						/>
						<label className="mt-3 ml-1" htmlFor="showPassword">
							Show Password
						</label>
					</div>
					<Button className="w-full py-2" type="submit" disabled={loading}>
						{loading ? "Submitting..." : "Submit"}
					</Button>
					<Button
						className="w-full mx-auto text-center py-2 mt-4 border-b-4 border-gray-700"
						type="button"
						variant="outline"
						onClick={() => setIsDialogOpen(true)}
					>
						Forgot Password?
					</Button>
				</form>
			</Form>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Reset Password</DialogTitle>
						<DialogDescription>
							Enter your identifier and new password below.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<label
								htmlFor="identifier"
								className="block text-sm font-medium text-gray-700 mb-3"
							>
								Identifier
							</label>
							<Input
								id="identifier"
								placeholder="Enter your email or phone number"
								value={identifier}
								onChange={(e) =>
									setIdentifier(e.target.value.trim().toLowerCase())
								}
							/>
						</div>
						<div>
							<label
								htmlFor="newPassword"
								className="block text-sm font-medium text-gray-700 mb-3"
							>
								New Password
							</label>
							<Input
								id="newPassword"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your new password"
								value={password}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-3"
							>
								Confirm New Password
							</label>
							<Input
								id="confirmPassword"
								type={showPassword ? "text" : "password"}
								placeholder="Re-enter your new password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
						<div className="flex items-center mb-4">
							<input
								id="showPasswordDialog"
								type="checkbox"
								checked={showPassword}
								onChange={() => setShowPassword(!showPassword)}
								className="mr-2"
							/>
							<label htmlFor="showPasswordDialog">Show Passwords</label>
						</div>
					</div>
					<DialogFooter>
						<Button
							className="my-4 md:my-0"
							onClick={handleResetPassword}
							disabled={forgotPasswordLoading} // Disable button when loading
						>
							{forgotPasswordLoading ? "Processing..." : "Submit"}
						</Button>
						<Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

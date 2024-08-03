"use client";

import { EventRegistration } from "@/lib/types/eventRegistration";
import { useAuth } from "./AuthProvider";
import { useState, FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { EventSession } from "@/lib/types/eventSession";
import { UserRoundPlus, UserRoundMinus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useToast } from "@/app/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface RegisterCardProps {
	session: EventSession;
}

export function RegisterCard({ session }: RegisterCardProps) {
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	const [identifier, setIdentifier] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [additionalInputs, setAdditionalInputs] = useState<
		{ name: string; address: string }[]
	>([]);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const { toast } = useToast();
	const router = useRouter();

	const addInput = () => {
		if (additionalInputs.length < 3) {
			setAdditionalInputs([...additionalInputs, { name: "", address: "" }]);
		}
	};

	const removeInput = () => {
		if (additionalInputs.length > 0) {
			setAdditionalInputs(additionalInputs.slice(0, -1));
		}
	};

	const handleDialogOpenChange = (isOpen: boolean) => {
		setIsDialogOpen(isOpen);
		if (!isOpen) {
			setIdentifier("");
			setName("");
			setAddress("");
			setAdditionalInputs([]);
		}
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const token = userData?.token;

		const payload = {
			name,
			identifier,
			address,
			eventCode: session.eventCode,
			sessionCode: session.code,
			otherRegister: additionalInputs,
		};

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/events/registration`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
						"X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
					},
					body: JSON.stringify(payload),
				}
			);

			const result = await response.json();

			if (response.ok) {
				toast({
					title: "Registration Successful",
					description: `You have successfully registered for ${session.name}! Redirecting to home page....`,
				});

				// Redirect to home page after a delay
				setTimeout(() => {
					router.push("/");
				}, 3000); // Adjust the delay as needed (3000ms = 3 seconds)
			} else {
				if (response.status === 422) {
					const errorResult = await response.json();
					const error = errorResult.errors?.find(
						(err: any) =>
							err.code === "INTERNAL_SERVER_ERROR" && err.field === "address"
					);

					if (error) {
						toast({
							title: "Registration Failed",
							description: `There was an issue with your registration: ${error.message}`,
							variant: "destructive",
						});
					} else {
						toast({
							title: "Registration Failed",
							description:
								"There was an issue with your registration. Please check your input and try again.",
							variant: "destructive",
						});
					}
				}
				if (response.status === 403) {
					toast({
						title: "Registration Failed",
						description:
							"Sorry, there are no available seats for your request anymore.",
						variant: "destructive",
					});
				}
				if (response.status === 400) {
					toast({
						title: "Registration Failed",
						description:
							"Sorry, you have registered too much! (More than 4 persons).",
						variant: "destructive",
					});
				}
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline">Register</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] max-w-full px-2 py-2 sm:px-4 sm:py-4 overflow-y-scroll max-h-screen">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{session.name}</DialogTitle>
						<DialogDescription>
							{new Date(session.time).toLocaleString()}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-2 sm:gap-4 py-2 sm:py-4">
						<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="identifier" className="text-right">
								Identifier
							</Label>
							<Input
								id="identifier"
								className="col-span-3"
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								placeholder="Please insert your email or phone number as identifier."
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								className="col-span-3"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="address" className="text-right">
								Address
							</Label>
							<Input
								id="address"
								className="col-span-3"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>
						{additionalInputs.map((input, index) => (
							<div key={index} className="grid gap-2 sm:gap-4">
								<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
									<Label
										htmlFor={`additional-name${index}`}
										className="text-right"
									>
										Additional Person {index + 1} Name
									</Label>
									<Input
										id={`additional-name${index}`}
										className="col-span-3"
										value={input.name}
										onChange={(e) =>
											setAdditionalInputs(
												additionalInputs.map((input, i) =>
													i === index
														? { ...input, name: e.target.value }
														: input
												)
											)
										}
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
									<Label
										htmlFor={`additional-address${index}`}
										className="text-right"
									>
										Additional Person {index + 1} Address
									</Label>
									<Input
										id={`additional-address${index}`}
										className="col-span-3"
										value={input.address}
										onChange={(e) =>
											setAdditionalInputs(
												additionalInputs.map((input, i) =>
													i === index
														? { ...input, address: e.target.value }
														: input
												)
											)
										}
									/>
								</div>
							</div>
						))}
					</div>
					<DialogFooter className="sticky bottom-0 bg-white">
						<div className="flex gap-2">
							{additionalInputs.length < 3 && (
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={addInput}
								>
									<UserRoundPlus />
								</Button>
							)}
							{additionalInputs.length > 0 && (
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={removeInput}
								>
									<UserRoundMinus />
								</Button>
							)}
						</div>
						<Button type="submit">Confirm Registration</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default RegisterCard;

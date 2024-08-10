"use client";

import { EventRegistration } from "@/lib/types/eventRegistration";
import { useAuth } from "./AuthProvider";
import { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import { EventSession } from "@/lib/types/eventSession";
import { SquarePlus, SquareMinus } from "lucide-react";
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
	const { isAuthenticated, handleExpiredToken } = useAuth();
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
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [addressError, setAddressError] = useState<string | null>(null);
	const [additionalAddressErrors, setAdditionalAddressErrors] = useState<
		string[]
	>([]);
	const { toast } = useToast();
	const router = useRouter();

	const addInput = () => {
		if (additionalInputs.length < 3) {
			setAdditionalInputs([...additionalInputs, { name: "", address: "" }]);
			setAdditionalAddressErrors([...additionalAddressErrors, ""]);
		}
	};

	const removeInput = () => {
		if (additionalInputs.length > 0) {
			setAdditionalInputs(additionalInputs.slice(0, -1));
			setAdditionalAddressErrors(additionalAddressErrors.slice(0, -1));
		}
	};

	const handleDialogOpenChange = (isOpen: boolean) => {
		setIsDialogOpen(isOpen);
		if (!isOpen) {
			setIdentifier("");
			setName("");
			setAddress("");
			setAdditionalInputs([]);
			setAddressError(null);
			setAdditionalAddressErrors([]);
		}
	};

	const validateAddress = (address: string) => {
		if (address.trim().length < 15) {
			return "Address must be at least 15 characters long.";
		} else {
			return null;
		}
	};

	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newAddress = e.target.value;
		setAddress(newAddress);
		setAddressError(validateAddress(newAddress));
	};

	const handleAdditionalAddressChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const newAddress = e.target.value;
		const updatedInputs = [...additionalInputs];
		updatedInputs[index].address = newAddress;
		setAdditionalInputs(updatedInputs);

		const error = validateAddress(newAddress);
		const updatedErrors = [...additionalAddressErrors];
		updatedErrors[index] = error || "";
		setAdditionalAddressErrors(updatedErrors);
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		// Validate main address
		if (address.trim().length < 15) {
			setAddressError("Address must be at least 15 characters long.");
		} else {
			setAddressError(null);
		}

		// Validate additional addresses
		const errors = additionalInputs.map(
			(input) => validateAddress(input.address) || "" // Convert null to empty string
		);
		setAdditionalAddressErrors(errors);

		if (address.trim().length < 15 || errors.some((error) => error !== "")) {
			setIsSubmitting(false);
			return;
		}

		const token = userData?.token;

		const payload = {
			name: name.trim(),
			identifier: identifier.trim(),
			address: address.trim(),
			eventCode: session.eventCode,
			sessionCode: session.code,
			otherRegister: additionalInputs.map((input) => ({
				name: input.name.trim(),
				address: input.address.trim(),
			})),
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
				if (response.status === 401) {
					handleExpiredToken();
					return; // Exit function after handling expired token
				}
				if (response.status === 422) {
					toast({
						title: "Registration Failed",
						description: "There was an issue with your registration.",
						variant: "destructive",
					});
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
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline">Register</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] max-w-full px-2 py-4 mt-2 sm:px-4 sm:py-4 overflow-y-scroll max-h-screen">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{session.name}</DialogTitle>
						<DialogDescription>
							{new Date(session.time).toLocaleString()}
							<p className="text-sm text-red-500 mt-2 font-bold">
								All fields are required.
							</p>
							<p className="text-sm text-red-500 mt-2 font-bold">
								One identifier can only register three additional people at
								most.
							</p>
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-2 sm:gap-4 py-2 sm:py-4">
						<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="identifier" className="text-right">
								Identifier <span className="text-red-500">*</span>
							</Label>
							<Input
								id="identifier"
								className="col-span-3"
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								placeholder="Insert your email or phone number."
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="name" className="text-right">
								Name <span className="text-red-500">*</span>
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
								Address <span className="text-red-500">*</span>
							</Label>
							<Input
								id="address"
								className="col-span-3"
								value={address}
								onChange={handleAddressChange}
								placeholder="Input a minimum of 15 characters."
							/>
							{addressError && (
								<p className="text-red-500 text-sm col-span-4">
									{addressError}
								</p>
							)}
						</div>
						{additionalInputs.map((input, index) => (
							<div key={index} className="grid gap-2 sm:gap-4">
								<div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
									<Label
										htmlFor={`additional-name${index}`}
										className="text-right"
									>
										Additional Person {index + 1} Name{" "}
										<span className="text-red-500">*</span>
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
								<div className="grid grid-cols-4 items-center gap-3 sm:gap-4">
									<Label
										htmlFor={`additional-address${index}`}
										className="text-right"
									>
										Additional Person {index + 1} Address{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id={`additional-address${index}`}
										className="col-span-3"
										value={input.address}
										placeholder="Input a minimum of 15 characters."
										onChange={(e) => handleAdditionalAddressChange(index, e)}
									/>
									{additionalAddressErrors[index] && (
										<p className="text-red-500 text-sm col-span-4">
											{additionalAddressErrors[index]}
										</p>
									)}
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
									<SquarePlus />
								</Button>
							)}
							{additionalInputs.length > 0 && (
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={removeInput}
								>
									<SquareMinus />
								</Button>
							)}
						</div>
						<Button
							type="submit"
							className="w-3/4 my-3 mx-auto"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Confirm Registration"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default RegisterCard;

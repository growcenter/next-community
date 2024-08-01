"use client";

import { useAuth } from "./AuthProvider";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { EventSession } from "@/lib/types/eventSession";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterCardProps {
	session: EventSession;
}

export function RegisterCard({ session }: RegisterCardProps) {
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	const [name, setName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [additionalInputs, setAdditionalInputs] = useState<
		{ name: string; address: string }[]
	>([]);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
			setName("");
			setAddress("");
			setAdditionalInputs([]);
		}
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const identifier = userData.email || userData.phoneNumber;
		const token = userData.token;

		const payload = {
			name,
			identifier,
			address,
			eventCode: session.eventCode,
			sessionCode: session.code,
			otherRegister: additionalInputs,
		};

		const response = await fetch(
			"http://localhost:8080/api/v1/events/registration",
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
		console.log(result);
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogTrigger asChild>
				<Button variant='outline'>Register</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{session.name}</DialogTitle>
						<DialogDescription>
							{new Date(session.time).toLocaleString()}
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='name' className='text-right'>
								Name
							</Label>
							<Input
								id='name'
								className='col-span-3'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='address' className='text-right'>
								Address
							</Label>
							<Input
								id='address'
								className='col-span-3'
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>
						{additionalInputs.map((input, index) => (
							<div key={index} className='grid gap-4'>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor={`additional-name${index}`} className='text-right'>
										Additional Person {index + 1} Name
									</Label>
									<Input
										id={`additional-name${index}`}
										className='col-span-3'
										value={input.name}
										onChange={(e) =>
											setAdditionalInputs(
												additionalInputs.map((input, i) =>
													i === index ? { ...input, name: e.target.value } : input
												)
											)
										}
									/>
								</div>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor={`additional-address${index}`} className='text-right'>
										Additional Person {index + 1} Address
									</Label>
									<Input
										id={`additional-address${index}`}
										className='col-span-3'
										value={input.address}
										onChange={(e) =>
											setAdditionalInputs(
												additionalInputs.map((input, i) =>
													i === index ? { ...input, address: e.target.value } : input
												)
											)
										}
									/>
								</div>
							</div>
						))}
					</div>
					<DialogFooter>
						<div className='flex gap-2'>
							{additionalInputs.length < 3 && (
								<Button type='button' onClick={addInput}>
									+
								</Button>
							)}
							{additionalInputs.length > 0 && (
								<Button type='button' onClick={removeInput}>
									-
								</Button>
							)}
						</div>
						<Button type='submit'>Confirm Registration</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default RegisterCard;

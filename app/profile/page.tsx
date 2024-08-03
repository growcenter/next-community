"use client";

import withAuth from "../components/AuthWrapper";
import { useAuth } from "../components/AuthProvider";
import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "../components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { EventRegistration } from "@/lib/types/eventRegistration";
import QRDialog from "../components/QRComponent";

function Registrations() {
	const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
	const [identifier, setIdentifier] = useState<string>("");
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [selectedRegistration, setSelectedRegistration] =
		useState<EventRegistration | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth <= 640); // Adjust the width as needed
		};

		handleResize(); // Initial check
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const fetchRegistrations = async () => {
		if (!userData?.token || !identifier) return;

		try {
			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_BASE_URL
				}/api/v1/events/registration?registeredBy=${encodeURIComponent(
					identifier
				)}`,
				{
					headers: {
						"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
						"Content-Type": "application/json",
						Authorization: `Bearer ${userData.token}`,
					},
				}
			);
			const data = await response.json();
			setRegistrations(data.data);
		} catch (error) {
			console.error("Failed to fetch registrations:", error);
		}
	};

	const handleSearch = () => {
		if (!identifier || !isValidEmail(identifier)) {
			alert("Please enter a valid email address.");
			return;
		}
		setIsSubmitted(true);
		fetchRegistrations();
	};

	const isValidEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const handleClear = () => {
		setIdentifier("");
		setRegistrations([]);
		setIsSubmitted(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleRowClick = (registration: EventRegistration) => {
		setSelectedRegistration(registration);
		setIsDialogOpen(true);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedRegistration(null);
	};

	const handleDelete = async (code: string) => {
		const confirm = window.confirm(
			"Are you sure you want to delete this registration?"
		);
		if (!confirm) return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/events/registration/${code}`,
				{
					method: "DELETE",
					headers: {
						"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
						"Content-Type": "application/json",
						Authorization: `Bearer ${userData?.token}`,
					},
				}
			);
			if (response.ok) {
				setRegistrations((prev) => prev.filter((reg) => reg.code !== code));
				alert("Registration deleted successfully.");
			} else {
				const errorResult = await response.json();
				alert("Failed to delete registration: " + errorResult.message);
			}
		} catch (error) {
			alert("An error occurred. Please try again.");
			console.error("An error occurred:", error);
		}
	};

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-scroll">
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
					<div className="mx-auto mt-4">
						<input
							type="text"
							placeholder="Enter Identifier"
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
							className="border p-2 rounded-md text-sm"
							onKeyDown={handleKeyDown}
						/>
						<Button className="ml-2" onClick={handleSearch}>
							Search
						</Button>
						<Button className="ml-2" onClick={handleClear} variant="outline">
							Clear
						</Button>
					</div>
					<Label className="text-sm  text-center text-red-500 font-style : italic">
						*Please input your identifier : email or phone number (format:
						081234567890)
					</Label>
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle>Registrations</CardTitle>
									<CardDescription>Your event registrations</CardDescription>
								</CardHeader>
								<CardContent>
									{isSubmitted && (
										<div className="overflow-x-auto">
											<Table className="min-w-full">
												<TableHeader>
													<TableRow>
														<TableHead>Name</TableHead>
														<TableHead className="hidden md:table-cell">
															Event
														</TableHead>
														<TableHead className="hidden md:table-cell">
															Session
														</TableHead>
														<TableHead className="hidden md:table-cell">
															Status
														</TableHead>
														<TableHead>QR</TableHead>
														<TableHead>Actions</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{registrations.length === 0 ? (
														<TableRow>
															<TableCell colSpan={6} className="text-center">
																No registrations found.
															</TableCell>
														</TableRow>
													) : (
														registrations.map((registration, index) => (
															<TableRow
																key={`${index}-main`}
																className="cursor-pointer"
															>
																<TableCell className="font-medium">
																	{isSmallScreen ? (
																		<button
																			className="text-blue-500 underline sm:no-underline"
																			onClick={() =>
																				handleRowClick(registration)
																			}
																		>
																			{registration.name}
																		</button>
																	) : (
																		registration.name
																	)}
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	{registration.eventName}
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	{registration.sessionName}
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	<Badge variant="outline">
																		{registration.status}
																	</Badge>
																</TableCell>
																<TableCell>
																	{registration.status === "registered" && (
																		<QRDialog
																			registrationCode={registration.code}
																		/>
																	)}
																</TableCell>
																<TableCell>
																	{registration.status === "registered" && (
																		<Button
																			variant="outline"
																			onClick={() =>
																				handleDelete(registration.code)
																			}
																		>
																			❌
																		</Button>
																	)}
																</TableCell>
															</TableRow>
														))
													)}
												</TableBody>
											</Table>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</main>
			</div>

			{selectedRegistration && (
				<Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
					<DialogContent className="sm:max-w-[425px] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>{selectedRegistration.name}</DialogTitle>
							<DialogDescription>
								{selectedRegistration.eventName}
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4">
							<div className="grid grid-cols-4 gap-4">
								<label className="text-right font-medium">Session</label>
								<p className="col-span-3">{selectedRegistration.sessionName}</p>
							</div>
							<div className="grid grid-cols-4 gap-4">
								<label className="text-right font-medium">Status</label>
								<p className="col-span-3">
									<Badge variant="outline">{selectedRegistration.status}</Badge>
								</p>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={handleDialogClose}>Close</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

export default withAuth(Registrations);

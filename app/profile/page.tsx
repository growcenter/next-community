"use client";

import { useRouter } from "next/navigation";
import withAuth from "../components/AuthWrapper";
import { useAuth } from "../components/AuthProvider";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import QRDialog from "../components/QRComponent";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { EventRegistration } from "@/lib/types/eventRegistration";

function Registrations() {
	const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
	const [identifier, setIdentifier] = useState<string>("");
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	const fetchRegistrations = async () => {
		if (!userData?.token || !identifier) return;

		try {
			const response = await fetch(
				`http://localhost:8080/api/v1/events/registration?registeredBy=${encodeURIComponent(
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
		// Regular expression for basic email validation
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

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
					<div className="mx-auto my-4">
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
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle>Registrations</CardTitle>
									<CardDescription>Your event registrations</CardDescription>
								</CardHeader>
								<CardContent>
									{isSubmitted && (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Session</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>QR</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{registrations.length === 0 ? (
													<TableRow>
														<TableCell colSpan={5} className="text-center">
															No registrations found.
														</TableCell>
													</TableRow>
												) : (
													registrations.map((registration, index) => (
														<TableRow key={`${index}-main`}>
															<TableCell className="font-medium">
																{registration.name}
															</TableCell>
															<TableCell>{registration.eventName}</TableCell>
															<TableCell>{registration.sessionName}</TableCell>
															<TableCell>
																<Badge variant="outline">
																	{registration.status}
																</Badge>
															</TableCell>
															<TableCell>
																<QRDialog
																	registrationCode={registration.code}
																/>
															</TableCell>
														</TableRow>
													))
												)}
											</TableBody>
										</Table>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</div>
	);
}

export default withAuth(Registrations);

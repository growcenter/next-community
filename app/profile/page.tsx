"use client";

import { useRouter } from "next/navigation";
import withAuth from "@/components/AuthWrapper";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import QRDialog from "@/components/QRComponent";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EventRegistration } from "@/lib/types/eventRegistration";

function Registrations() {
	const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;
	const router = useRouter();

	useEffect(() => {
		async function fetchRegistrations() {
			if (!userData?.token) return;

			const registeredBy = userData.email || userData.phoneNumber;
			const response = await fetch(
				`http://localhost:8080/api/v1/events/registration?registeredBy=${encodeURIComponent(
					registeredBy
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
			console.log(data.data);
			setRegistrations(data.data);
		}

		fetchRegistrations();
	}, []);

	return (
		<div className='flex min-h-screen w-full flex-col bg-muted/40'>
			<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
				<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
					<Tabs defaultValue='all'>
						<TabsContent value='all'>
							<Card x-chunk='dashboard-06-chunk-0'>
								<CardHeader>
									<CardTitle>Registrations</CardTitle>
									<CardDescription>Your event registrations</CardDescription>
								</CardHeader>
								<CardContent>
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
											{registrations.flatMap((registration, index) => [
												// Main Registration Row
												<TableRow key={`${index}-main`}>
													<TableCell className='font-medium'>
														{registration.name}
													</TableCell>
													<TableCell>{registration.eventName}</TableCell>
													<TableCell>{registration.sessionName}</TableCell>
													<TableCell>
														<Badge variant='outline'>
															{registration.status}
														</Badge>
													</TableCell>
													<TableCell>
														<QRDialog registrationCode={registration.code} />
													</TableCell>
												</TableRow>,
											])}
										</TableBody>
									</Table>
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

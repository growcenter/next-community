"use client";

import withAuth from "@/components/AuthWrapper";
import { useAuth } from "@/components/AuthProvider";
import { EventSession } from "@/lib/types/eventSession";
import { RegisterCard } from "@/components/RegisterCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

function EventSessions({ params }: { params: { eventCode: string } }) {
	const [sessions, setSessions] = useState<EventSession[]>([]);
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;
	const router = useRouter();

	useEffect(() => {
		async function fetchSessions() {
			if (!userData?.token || !params.eventCode) return;

			const response = await fetch(
				`http://localhost:8080/api/v1/events/${params.eventCode}/sessions`,
				{
					headers: {
						"X-API-KEY": "gc2024",
						"Content-Type": "application/json",
						Authorization: `Bearer ${userData.token}`,
					},
				}
			);
			const data = await response.json();
			setSessions(data.data);
		}

		fetchSessions();
	}, [params.eventCode]);

	return (
		<>
			<div className='flex min-h-screen w-full flex-col bg-muted/40'>
				<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
					<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
						<Tabs defaultValue='all'>
							<TabsContent value='all'>
								<Card x-chunk='dashboard-06-chunk-0'>
									<CardHeader>
										<CardTitle>Event Sessions</CardTitle>
										<CardDescription>
											Sessions for Event Code: {params.eventCode}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Session Name</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Description</TableHead>
													<TableHead>Time</TableHead>
													<TableHead>Available Seats</TableHead>
													<TableHead></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{sessions.map((session) => (
													<TableRow key={session.code}>
														<TableCell className='font-medium'>
															{session.name}
														</TableCell>
														<TableCell>
															<Badge variant='outline'>{session.status}</Badge>
														</TableCell>
														<TableCell>{session.description}</TableCell>
														<TableCell>
															{new Date(session.time).toLocaleString()}
														</TableCell>
														<TableCell>{session.availableSeats}</TableCell>
														<TableCell>
															<RegisterCard session={session}></RegisterCard>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</main>
				</div>
			</div>
		</>
	);
}

export default withAuth(EventSessions);

"use client";

import { useRouter } from "next/navigation";
import withAuth from "../../components/AuthWrapper";
import { useAuth } from "../../components/AuthProvider";
import { Event } from "../../lib/types/event";
import { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../../components/ui/button";

function Events() {
	const [events, setEvents] = useState<Event[]>([]);
	const { isAuthenticated, login, logout } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;
	const router = useRouter();

	function handleSession(code: string) {
		return router.push(`/events/${code}`);
	}

	useEffect(() => {
		async function fetchEvents() {
			if (!userData?.token) return;

			const response = await fetch("http://localhost:8080/api/v1/events", {
				headers: {
					"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
					"Content-Type": "application/json",
					Authorization: `Bearer ${userData.token}`,
				},
			});
			const data = await response.json();
			setEvents(data.data);
		}

		fetchEvents();
	}, []);

	return (
		<>
			<div className='flex min-h-screen w-full flex-col bg-muted/40'>
				<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
					<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
						<Tabs defaultValue='all'>
							<TabsContent value='all'>
								<Card x-chunk='dashboard-06-chunk-0'>
									<CardHeader>
										<CardTitle>Events</CardTitle>
										<CardDescription>Grow Community`&apos;`s Events</CardDescription>
									</CardHeader>
									<CardContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Description</TableHead>
													
													<TableHead>Registration Time</TableHead>
													<TableHead></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{events.map((event) => (
													<TableRow key={event.id}>
														<TableCell className='font-medium'>
															{event.name}
														</TableCell>
														<TableCell>
															<Badge variant='outline'>{event.status}</Badge>
														</TableCell>
														<TableCell>{event.description}</TableCell>
														
														<TableCell>
															{new Date(
																event.openRegistration
															).toLocaleString()}{" "}
															-{" "}
															{new Date(
																event.closedRegistration
															).toLocaleString()}
														</TableCell>
														<TableCell>
															{event.status == "active" && (
															<Button onClick={() => handleSession(event.code)}>	
																View
															</Button>)}
															
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

export default withAuth(Events);

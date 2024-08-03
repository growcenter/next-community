"use client";

import withAuth from "../../components/AuthWrapper";
import { useAuth } from "../../components/AuthProvider";
import { EventSession } from "../../../lib/types/eventSession";
import { RegisterCard } from "../../components/RegisterCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	DialogFooter,
} from "../../components/ui/dialog";

function EventSessions({ params }: { params: { eventCode: string } }) {
	const [sessions, setSessions] = useState<EventSession[]>([]);
	const [selectedSession, setSelectedSession] = useState<EventSession | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
	const { isAuthenticated } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;
	const router = useRouter();

	useEffect(() => {
		async function fetchSessions() {
			if (!userData?.token || !params.eventCode) return;

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/events/${params.eventCode}/sessions`,
				{
					headers: {
						"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
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

	// Detect screen size
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

	const handleSessionClick = (session: EventSession) => {
		setSelectedSession(session);
		setIsDialogOpen(true);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedSession(null);
	};

	return (
		<>
			<div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-scroll">
				<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
					<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
						<Tabs defaultValue="all">
							<TabsContent value="all">
								<Card x-chunk="dashboard-06-chunk-0">
									<CardHeader>
										<CardTitle>Event Sessions</CardTitle>
										<CardDescription>
											Sessions for Event Code: {params.eventCode}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="overflow-x-auto">
											<Table className="min-w-full">
												<TableHeader>
													<TableRow>
														<TableHead>Session Name</TableHead>
														<TableHead>Status</TableHead>
														<TableHead className="hidden sm:table-cell">
															Description
														</TableHead>
														<TableHead className="hidden sm:table-cell">
															Time
														</TableHead>
														<TableHead className="hidden sm:table-cell">
															Available Seats
														</TableHead>
														<TableHead></TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{sessions.map((session) => (
														<TableRow key={session.code}>
															<TableCell className="font-medium">
																{isSmallScreen ? (
																	<button
																		onClick={() => handleSessionClick(session)}
																		className="text-blue-500 underline sm:no-underline"
																	>
																		{session.name}
																	</button>
																) : (
																	session.name
																)}
															</TableCell>
															<TableCell>
																<Badge variant="outline">
																	{session.status}
																</Badge>
															</TableCell>
															<TableCell className="hidden sm:table-cell">
																{session.description}
															</TableCell>
															<TableCell className="hidden sm:table-cell">
																{new Date(session.time).toLocaleString()}
															</TableCell>
															<TableCell className="hidden sm:table-cell">
																{session.availableSeats}
															</TableCell>
															<TableCell>
																{session.status === "active" && (
																	<RegisterCard
																		session={session}
																	></RegisterCard>
																)}
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
										{selectedSession && (
											<Dialog
												open={isDialogOpen}
												onOpenChange={handleDialogClose}
											>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>{selectedSession.name}</DialogTitle>
														<DialogDescription>
															{selectedSession.status}
														</DialogDescription>
													</DialogHeader>
													<p>{selectedSession.description}</p>
													<p>
														Time:{" "}
														{new Date(selectedSession.time).toLocaleString()}
													</p>
													<p>
														Available Seats: {selectedSession.availableSeats}
													</p>
													<DialogFooter>
														<Button onClick={handleDialogClose}>Close</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										)}
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

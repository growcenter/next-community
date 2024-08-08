"use client";

import { useRouter } from "next/navigation";
import withAuth from "@/app/components/AuthWrapper";
import { useAuth } from "@/app/components/AuthProvider";
import { Event } from "../../lib/types/event";
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
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/components/ui/tabs";
import { Button } from "../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	DialogFooter,
} from "@/app/components/ui/dialog";
import { LoadingSpinner } from "../components/ui/loading-spinner";

function EventsAdmin() {
	const [events, setEvents] = useState<Event[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state
	const { isAuthenticated, handleExpiredToken } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;
	const router = useRouter();

	function handleSession(code: string) {
		return router.push(`/dashboard/${code}`);
	}

	useEffect(() => {
		async function fetchEvents() {
			if (!userData?.token) return;

			setIsLoading(true); // Set loading to true before fetching

			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/events`,
					{
						headers: {
							"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
							"Content-Type": "application/json",
							Authorization: `Bearer ${userData.token}`,
						},
					}
				);
				if (response.status === 401) {
					handleExpiredToken();
					return;
				}
				const data = await response.json();
				setEvents(data.data);
			} catch (error) {
				console.error("Failed to fetch events:", error);
			} finally {
				setIsLoading(false); // Set loading to false after fetching
			}
		}

		fetchEvents();
	}, []);

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

	const handleEventClick = (event: Event) => {
		setSelectedEvent(event);
		setIsDialogOpen(true);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedEvent(null);
	};

	return (
		<>
			<div className="flex min-h-screen w-full flex-col">
				<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
					<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
						<Tabs defaultValue="all">
							<TabsContent value="all">
								<Card x-chunk="dashboard-06-chunk-0">
									<CardHeader>
										<CardTitle>Admin Dashboard</CardTitle>
										<CardDescription>
											Grow Community Admin Panel
										</CardDescription>
									</CardHeader>
									<CardContent>
										{isLoading ? ( // Display spinner while loading
											<div className="flex justify-center items-center h-64">
												<LoadingSpinner />
											</div>
										) : (
											<div className="overflow-x-auto">
												<Table className="min-w-full">
													<TableHeader>
														<TableRow>
															<TableHead>Event Name</TableHead>
															<TableHead>Status</TableHead>
															<TableHead className="hidden sm:table-cell">
																Description
															</TableHead>
															<TableHead className="hidden sm:table-cell">
																Registration Time
															</TableHead>
															<TableHead></TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{events.map((event) => (
															<TableRow key={event.id}>
																<TableCell className="font-medium">
																	{isSmallScreen ? (
																		<button
																			onClick={() => handleEventClick(event)}
																			className="text-blue-500 underline sm:no-underline"
																		>
																			{event.name}
																		</button>
																	) : (
																		event.name
																	)}
																</TableCell>
																<TableCell>
																	<Badge variant="outline">
																		{event.status}
																	</Badge>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	{event.description}
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	{new Date(
																		event.openRegistration
																	).toLocaleString()}{" "}
																	-{" "}
																	{new Date(
																		event.closedRegistration
																	).toLocaleString()}
																</TableCell>
																<TableCell>
																	{event.status === "active" && (
																		<Button
																			onClick={() => handleSession(event.code)}
																		>
																			View
																		</Button>
																	)}
																</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											</div>
										)}
										{selectedEvent && (
											<Dialog
												open={isDialogOpen}
												onOpenChange={handleDialogClose}
											>
												<DialogContent className="sm:max-w-[425px] max-w-full py-2 sm:px-4 sm:py-4">
													<DialogHeader>
														<DialogTitle>{selectedEvent.name}</DialogTitle>
														<DialogDescription>
															{selectedEvent.status}
														</DialogDescription>
													</DialogHeader>
													<p>{selectedEvent.description}</p>
													<p>
														Registration Time:{" "}
														{new Date(
															selectedEvent.openRegistration
														).toLocaleString()}{" "}
														-{" "}
														{new Date(
															selectedEvent.closedRegistration
														).toLocaleString()}
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

export default withAuth(EventsAdmin);

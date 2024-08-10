"use client";

import { EventRegistration } from "../../../lib/types/eventRegistration";
import { EventSession } from "../../../lib/types/eventSession";
import withAuth from "../../components/AuthWrapper";
import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "../../components/ui/badge";
import QrCodeScanner from "../../components/QRScanner";
import VerifyTicketDialog from "../../components/VerifyTicketDialog";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
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
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../../components/ui/pagination";
import { Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

function EventSessionsAdmin({ params }: { params: { eventCode: string } }) {
	const router = useRouter();
	const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
	const [sessions, setSessions] = useState<EventSession[]>([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedSession, setSelectedSession] = useState<string | null>(null);
	const [selectedSessionName, setSelectedSessionName] = useState<string | null>(
		null
	);
	const [scannerValid, setScannerValid] = useState<boolean>(false);
	const [eventName, setEventName] = useState<string | null>(null);
	const { isAuthenticated, handleExpiredToken } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	// Fetch sessions
	const fetchSessions = async () => {
		setLoading(true);
		try {
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
			if (data && Array.isArray(data.data)) {
				setSessions(data.data);
			} else {
				setSessions([]);
				console.error(
					"API response does not contain an array of sessions:",
					data
				);
			}
		} catch (error) {
			setSessions([]);
			console.error("Error fetching sessions:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchRegistrationsNumber = async (page: number) => {
		setLoading(true);
		try {
			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_BASE_URL
				}/api/v1/internal/events/registrations?eventCode=${
					params.eventCode
				}&sessionCode=${
					selectedSession || ""
				}&page=${page}&limit=10&search=${searchQuery}`,
				{
					headers: {
						"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
						"Content-Type": "application/json",
						Authorization: `Bearer ${userData.token}`,
					},
				}
			);
			const data = await response.json();
			if (data && Array.isArray(data.data)) {
				setRegistrations(data.data);
				if (data.data.length > 0) {
					setEventName(data.data[0].eventName);
				}
			} else {
				setRegistrations([]);
				console.error(
					"API response does not contain an array of registrations:",
					data
				);
			}
		} catch (error) {
			setRegistrations([]);
			console.error("Error fetching registrations:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch registrations based on the selected session
	const fetchRegistrations = async () => {
		if (userData.role == "usher") {
			return;
		}
		setLoading(true);
		try {
			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_BASE_URL
				}/api/v1/internal/events/registrations?eventCode=${
					params.eventCode
				}&sessionCode=${
					selectedSession || ""
				}&page=${currentPage}&limit=10&search=${searchQuery}`,
				{
					headers: {
						"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
						"Content-Type": "application/json",
						Authorization: `Bearer ${userData.token}`,
					},
				}
			);
			const data = await response.json();
			if (data && Array.isArray(data.data)) {
				setRegistrations(data.data);
				if (data.data.length > 0) {
					setEventName(data.data[0].eventName);
				}
			} else {
				setRegistrations([]);
				console.error(
					"API response does not contain an array of registrations:",
					data
				);
			}
		} catch (error) {
			setRegistrations([]);
			console.error("Error fetching registrations:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch sessions and registrations on component mount
	useEffect(() => {
		fetchSessions();
		fetchRegistrations();
	}, [params.eventCode]); // Depend on eventCode to refetch sessions if it changes

	useEffect(() => {
		if (selectedSession) {
			fetchRegistrations();
		} else {
			setRegistrations([]); // Clear registrations if no session is selected
		}
	}, [selectedSession, currentPage]); // Depend on selectedSession, currentPage, and searchQuery

	const handleSearch = () => {
		setCurrentPage(1); // Reset to first page on new search
		fetchRegistrations();
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		fetchRegistrationsNumber(newPage);
	};

	const selectedSessionDetails = sessions.find(
		(session) => session.code === selectedSession
	);
	const [scannedSeats, setScannedSeats] = useState<number>(
		selectedSessionDetails?.scannedSeats || 0
	);
	useEffect(() => {
		if (selectedSessionDetails) {
			setScannedSeats(selectedSessionDetails.scannedSeats || 0);
		}
	}, [selectedSessionDetails]);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleManualVerify = async (code: string) => {
		setLoading(true);
		setRegistrations((prevRegistrations) =>
			prevRegistrations.map((registration) =>
				registration.code === code
					? { ...registration, status: "verified" }
					: registration
			)
		);
		setScannedSeats((prevScannedSeats) => prevScannedSeats + 1);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/internal/events/registrations/${code}`,
				{
					method: "PATCH",
					headers: {
						"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
						"Content-Type": "application/json",
						Authorization: `Bearer ${userData.token}`,
					},
					body: JSON.stringify({
						status: "verified",
						sessionCode: `${selectedSession}`,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			console.log("Success: Registration verified");
		} catch (error) {
			console.error("Error:", error);
			// Rollback optimistic update in case of error
			setRegistrations((prevRegistrations) =>
				prevRegistrations.map((registration) =>
					registration.code === code
						? { ...registration, status: "pending" }
						: registration
				)
			);
			setScannedSeats((prevScannedSeats) => prevScannedSeats - 1);
		} finally {
			setLoading(false);
		}
	};
	const handleCheckSession = async (code: string) => {
		setLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/events/summary/${code}`,
				{
					method: "GET",
					headers: {
						"X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
						"Content-Type": "application/json",
						Authorization: `Bearer ${userData.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			const data = await response.json();
			setScannerValid(data.isScannerValid);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex flex-col lg:flex-row w-full p-4 mb-10 sm:px-6 sm:py-0 mt-8 gap-4">
			<section className="flex flex-col gap-4 md:gap-8 lg:w-1/4">
				{/* Sessions Card */}
				<Card className="text-center justify-center content-center p-1 w-full">
					<CardHeader className="pb-3">
						<CardTitle className="text-center mb-6">Sessions</CardTitle>
					</CardHeader>
					{loading ? (
						<LoadingSpinner></LoadingSpinner>
					) : (
						<CardFooter className="flex flex-col w-fit mx-auto gap-2 content-center justify-center">
							{sessions.map((session) => (
								<Button
									className={`w-full ${
										selectedSession === session.code
											? "bg-green-500 text-white"
											: ""
									}`}
									key={session.code}
									onClick={() => {
										setSelectedSession(session.code);
										setSelectedSessionName(session.name);
										handleCheckSession(session.code);
									}}
								>
									{session.name}
								</Button>
							))}
						</CardFooter>
					)}
				</Card>
				{/* Registered and Scanned Cards */}
				<Card className="text-center p-3">
					{loading ? (
						<LoadingSpinner></LoadingSpinner>
					) : (
						<>
							{" "}
							<CardHeader className="pb-2 text-center">
								<CardDescription className="text-xl">
									Current Session:
								</CardDescription>
								<CardTitle className="text-4xl">
									{selectedSessionName || "None"}
								</CardTitle>
							</CardHeader>
							<CardHeader className="pb-2">
								<CardDescription className="text-xl">
									Registered seats:{" "}
								</CardDescription>
								<CardTitle className="text-3xl">
									{selectedSessionDetails?.registeredSeats ?? 0}
								</CardTitle>
							</CardHeader>
							<CardHeader className="pb-2">
								<CardDescription className="text-xl">
									Unscanned seats:{" "}
								</CardDescription>
								<CardTitle className="text-3xl">
									{(selectedSessionDetails?.registeredSeats ?? 0) -
										scannedSeats}
								</CardTitle>
							</CardHeader>
							<CardHeader className="pb-2">
								<CardDescription className="text-lg">
									Scanned seats:{" "}
								</CardDescription>
								<CardTitle className="text-3xl">{scannedSeats}</CardTitle>
							</CardHeader>
						</>
					)}
				</Card>
				{/* Current Session Card */}
				<Card className="flex flex-col items-center justify-center">
					<CardHeader className="pb-2 text-center">
						<CardDescription className="text-xl">
							Current Session:
						</CardDescription>
						<CardTitle className="text-4xl">
							{selectedSessionName || "None"}
						</CardTitle>
					</CardHeader>
					{scannerValid && (
						<CardFooter className="mt-5">Scanner disabled!</CardFooter>
					) ? (
						<>
							<CardFooter className="mt-5">
								<VerifyTicketDialog
									sessionCode={selectedSession || ""}
									sessionName={selectedSessionName || ""}
								/>
							</CardFooter>
						</>
					) : (
						<CardFooter className="mt-5">Scanner disabled!</CardFooter>
					)}
				</Card>
			</section>

			{isAuthenticated && userData.role == "usher" ? (
				<></>
			) : (
				<section className="flex flex-col gap-4 md:gap-8 lg:w-3/4">
					{/* Registrations Table Card */}
					<Card>
						<CardHeader className="px-7">
							<CardTitle className="text-xs md:text-lg">
								Registrations for: {eventName}
							</CardTitle>
							<CardDescription className="font-bold text-red-700 text-xs md:text-lg">
								*Search by Name, Identifier, or Registered By
							</CardDescription>
							<div className="flex items-center gap-2">
								<Input
									type="search"
									placeholder="Search..."
									className="rounded-lg bg-background border-gray-600 md:w-[200px] lg:w-[336px]"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={handleKeyDown}
								/>
								<Button className="w-14" onClick={handleSearch}>
									<Search />
								</Button>
								<Button
									className="w-14"
									onClick={() => {
										setSearchQuery("");
										setCurrentPage(1);
										fetchRegistrations();
									}}
								>
									Reset
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<Table className="w-full text-sm md:text-base">
								<TableHeader className="hidden md:table-header-group">
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Identifier</TableHead>
										<TableHead className="hidden sm:table-cell">
											Registered By
										</TableHead>
										<TableHead className="hidden sm:table-cell">
											Status
										</TableHead>
										<TableHead className="hidden sm:table-cell">
											Verify
										</TableHead>
									</TableRow>
								</TableHeader>
								{loading ? (
									<LoadingSpinner />
								) : (
									<TableBody>
										{registrations.map((registration, index) => (
											<TableRow
												key={index}
												className="border-b border-gray-200"
											>
												<TableCell className="flex flex-col sm:table-cell">
													<div className="font-medium">{registration.name}</div>
													<div className="text-sm text-muted-foreground sm:hidden">
														{registration.accountNumber}
													</div>
												</TableCell>
												<TableCell className="flex flex-col sm:table-cell">
													<div className="inline sm:hidden text-sm">
														<span className="font-medium">Identifier:</span>{" "}
														{registration.identifier}
													</div>
													<div className="inline sm:hidden text-sm">
														<span className="font-medium">Registered By:</span>{" "}
														{registration.registeredBy}
													</div>
													<div className="inline sm:hidden text-sm">
														<span className="font-medium">Status:</span>{" "}
														{registration.status}
													</div>
													<div className="inline sm:hidden text-sm mt-2">
														{!(
															registration.status === "cancelled" ||
															registration.status === "verified"
														) && (
															<Button
																onClick={() => {
																	handleManualVerify(registration.code);
																}}
																variant="default"
															>
																Verify
															</Button>
														)}
													</div>
												</TableCell>

												<TableCell className="hidden sm:table-cell">
													{registration.registeredBy}
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge
														style={
															registration.status === "verified"
																? { backgroundColor: "green", color: "white" } // Adjust colors as needed
																: undefined
														}
														variant={
															registration.status === "cancelled"
																? "destructive"
																: "default"
														}
													>
														{registration.status}
													</Badge>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													{!(
														registration.status === "cancelled" ||
														registration.status === "verified"
													) && (
														<Button
															onClick={() => {
																handleManualVerify(registration.code);
															}}
															variant="default"
														>
															{loading ? "Verifying" : "Verify"}
														</Button>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								)}
							</Table>
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											href="#"
											onClick={() =>
												handlePageChange(Math.max(currentPage - 1, 1))
											}
										/>
									</PaginationItem>
									<PaginationItem>
										<PaginationLink href="#" isActive>
											{currentPage}
										</PaginationLink>
									</PaginationItem>
									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={() => handlePageChange(currentPage + 1)}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</CardContent>
					</Card>
				</section>
			)}
		</main>
	);
}

export default withAuth(EventSessionsAdmin);

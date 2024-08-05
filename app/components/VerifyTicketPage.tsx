// VerifyTicketPage.tsx
import React, { useState } from "react";
import QRCodeScanner from "./QRScanner";
import { useAuth } from "./AuthProvider";

interface TicketInfo {
	type: string;
	name: string;
	identifier: string;
	accountNumber: string;
	code: string;
	registeredBy: string;
	updatedBy: string;
	status: string;
}

const VerifyTicketPage: React.FC = () => {
	const [message, setMessage] = useState<string>("");
	const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
	const { isAuthenticated, handleExpiredToken } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	const handleScanSuccess = async (ticketCode: string) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/internal/events/registrations/${ticketCode}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						"X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
						Authorization: `Bearer ${userData.token}`,
					},
					body: JSON.stringify({
						code: ticketCode,
						status: "verified", // or the appropriate status value
						sessionCode: "S2", // replace with actual session code if needed
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				setTicketInfo(data);
				setMessage("Ticket is valid!");
			} else {
				const errorData = await response.json();
				setMessage(`Invalid ticket! Error: ${errorData.message}`);
			}
		} catch (error) {
			setMessage("Error verifying ticket.");
		}
	};

	return (
		<div>
			<h1>Scan Ticket QR Code</h1>
			<QRCodeScanner onScanSuccess={handleScanSuccess} />
			<p>{message}</p>
			{ticketInfo && (
				<div>
					<h2>Ticket Information</h2>
					<p>Name: {ticketInfo.name}</p>
					<p>Identifier: {ticketInfo.identifier}</p>
					<p>Account Number: {ticketInfo.accountNumber}</p>
					<p>Code: {ticketInfo.code}</p>
					<p>Registered By: {ticketInfo.registeredBy}</p>
					<p>Updated By: {ticketInfo.updatedBy}</p>
					<p>Status: {ticketInfo.status}</p>
				</div>
			)}
		</div>
	);
};

export default VerifyTicketPage;

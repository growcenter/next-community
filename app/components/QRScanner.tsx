import { useState } from "react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useToast } from "./ui/use-toast"; // Import use-toast hook
import { Button } from "./ui/button"; // Import the Button component for the toast action
import { useAuth } from "./AuthProvider";

function QrCodeScanner({ sessionCode }: { sessionCode: string }) {
	const { toast } = useToast(); // Initialize the toast hook
	const { isAuthenticated, handleExpiredToken } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	const handleScan = async (result: IDetectedBarcode[]) => {
		if (result && result.length > 0) {
			const uuid = result[0]?.rawValue;

			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/internal/events/registrations/${uuid}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${userData.token}`,
							"X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
						},
						body: JSON.stringify({
							sessionCode: sessionCode,
							status: "active",
						}),
					}
				);

				if (response.ok) {
					toast({
						title: "Success!",
						description: "User verified.",
						duration: 3000,
						className: "bg-green-500 text-lg p-4 rounded-lg",
					});
				} else {
					const errorData = await response.json();
					toast({
						title: errorData.status || "Error",
						description: errorData.message || "Something went wrong.",
						variant: "destructive",
						duration: 5000,
						className: "text-xl p-4 rounded-lg",
					});
				}
			} catch (error) {
				toast({
					title: `Error : ${error}`,
					description: "Error while connecting to the API.",
					variant: "destructive",
					duration: 3000,
					className: "text-xl p-4 rounded-lg",
				});
				console.error("Error while connecting to the API", error);
			}
		}
	};

	return <Scanner scanDelay={5000} allowMultiple={true} onScan={handleScan} />;
}

export default QrCodeScanner;

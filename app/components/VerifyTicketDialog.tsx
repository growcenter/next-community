import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import QrCodeScanner from "./QRScanner";

const VerifyTicketDialog = ({
	sessionCode,
	sessionName,
}: {
	sessionCode: string;
	sessionName: string;
}) => {
	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button className="w-36 h-10">Scanner</Button>
				</DialogTrigger>
				<DialogContent className="w-full max-w-lg sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>
							Current Session: {sessionName} ({sessionCode})
						</DialogTitle>
					</DialogHeader>
					{sessionCode ? (
						<QrCodeScanner sessionCode={sessionCode} />
					) : (
						<div className="text-red-500">Error: Please select a session.</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default VerifyTicketDialog;

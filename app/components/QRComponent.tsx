"use client";
import React from "react";
import { useQRCode } from "next-qrcode";
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

interface QRDialogProps {
	registrationCode: string;
	name: string;
	eventName: string;
	sessionName: string;
}

const QRDialog: React.FC<QRDialogProps> = ({
	registrationCode,
	name,
	eventName,
	sessionName,
}) => {
	const { Image } = useQRCode();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="text-center " variant="outline">
					Show
				</Button>
			</DialogTrigger>
			<DialogContent
				aria-describedby="QR Code for the user's current registration"
				className="sm:max-w-[425px] mx-auto overflow-y-scroll max-h-screen"
			>
				<DialogHeader>
					<div className="flex flex-col items-center">
						<b>{name}</b>
						<span>{eventName}</span>
						<span className="text-gray-400">{sessionName}</span>
					</div>
				</DialogHeader>
				<Image
					text={registrationCode}
					options={{
						type: "image/jpeg",
						quality: 0.8,
						errorCorrectionLevel: "M",
						margin: 3,
						scale: 10,
						width: 400,
						color: {
							dark: "#000000",
							light: "#FFFFFF",
						},
					}}
				/>
				<span className="text-xs text-gray-500 text-center">
					{registrationCode}
				</span>
			</DialogContent>
		</Dialog>
	);
};

export default QRDialog;

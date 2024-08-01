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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QRDialogProps {
	registrationCode: string;
}

const QRDialog: React.FC<QRDialogProps> = ({ registrationCode }) => {
	const { Image } = useQRCode();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>Show QR Code</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] mx-auto'>
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
			</DialogContent>
		</Dialog>
	);
};

export default QRDialog;

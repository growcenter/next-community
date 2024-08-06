import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRCodeScannerProps {
	onScanSuccess: (decodedText: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess }) => {
	const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

	useEffect(() => {
		// Initialize the scanner only once
		if (!scanner) {
			const html5QrCodeScanner = new Html5QrcodeScanner(
				"reader", // Use the id directly as a string
				{ fps: 10, qrbox: 250 },
				false
			);

			const onScanSuccessHandler = (decodedText: string) => {
				onScanSuccess(decodedText);
			};

			const onScanFailure = (error: string) => {
				console.warn(`QR code scan error: ${error}`);
			};

			html5QrCodeScanner.render(onScanSuccessHandler, onScanFailure);
			setScanner(html5QrCodeScanner);
		}

		// Clean up the scanner when the component is unmounted or when scanner changes
		return () => {
			if (scanner) {
				scanner.clear().catch((error) => {
					console.error("Failed to clear html5QrCodeScanner:", error);
				});
			}
		};
	}, [scanner, onScanSuccess]); // Depend on scanner to ensure initialization happens only once

	const handleClearScanner = () => {
		if (scanner) {
			scanner.clear().catch((error) => {
				console.error("Failed to clear html5QrCodeScanner:", error);
			});
			setScanner(null); // Reset scanner state
		}
	};

	return (
		<div>
			<div
				id='reader'
				className='w-full max-w-md h-64 border-2 border-gray-300 rounded-lg bg-gray-100 shadow-md'
			></div>
			<button
				onClick={handleClearScanner}
				className='mt-4 p-2 bg-red-500 text-white rounded'
			>
				Clear Scanner
			</button>
		</div>
	);
};

export default QRCodeScanner;

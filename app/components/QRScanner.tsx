import React, { useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeResult } from "html5-qrcode";

function QrCodeScanner({ sessionCode }: { sessionCode: string }) {
	const [isScanning, setIsScanning] = useState(false);
	const html5QrCodeScannerRef = useRef<Html5QrcodeScanner | null>(null);

	const onScanSuccess = (
		decodedText: string,
		decodedResult: Html5QrcodeResult
	) => {
		console.log(`Scan result: ${decodedText}`, decodedResult);
		alert(`Scan result: ${decodedText}`);
		// Stop scanning after a successful scan
		if (html5QrCodeScannerRef.current) {
			html5QrCodeScannerRef.current
				.clear()
				.then(() => {
					html5QrCodeScannerRef.current = null;
					setIsScanning(false);
				})
				.catch((err) => {
					console.error("Failed to clear qr scanner", err);
				});
		}
	};

	const onScanError = (errorMessage: string) => {
		// Handle errors here
	};

	const startScanner = () => {
		if (!html5QrCodeScannerRef.current) {
			html5QrCodeScannerRef.current = new Html5QrcodeScanner(
				"reader",
				{ fps: 10, qrbox: 200 },
				false // Disable verbose logging
			);
			html5QrCodeScannerRef.current.render(onScanSuccess, onScanError);
			setIsScanning(true);
		}
	};

	const clearScanner = () => {
		if (html5QrCodeScannerRef.current) {
			html5QrCodeScannerRef.current
				.clear()
				.then(() => {
					html5QrCodeScannerRef.current = null;
					setIsScanning(false);
				})
				.catch((err) => {
					console.error("Failed to clear qr scanner", err);
				});
		}
	};

	return (
		<div className="w-full h-full mx-auto">
			<div className="w-full h-[300px] sm:h-[500px]" id="reader"></div>
			<button onClick={startScanner} disabled={isScanning}>
				Start Scanner
			</button>
			<button onClick={clearScanner} disabled={!isScanning}>
				Clear Scanner
			</button>
		</div>
	);
}

export default QrCodeScanner;

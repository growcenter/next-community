// QRCodeScanner.tsx
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRCodeScannerProps {
	onScanSuccess: (decodedText: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess }) => {
	const scannerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scannerRef.current) {
			const html5QrCodeScanner = new Html5QrcodeScanner(
				scannerRef.current.id,
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

			// Clean up the scanner when the component is unmounted
			return () => {
				html5QrCodeScanner.clear().catch((error) => {
					console.error("Failed to clear html5QrCodeScanner:", error);
				});
			};
		}
	}, [onScanSuccess]);

	return <div id="reader" ref={scannerRef}></div>;
};

export default QRCodeScanner;

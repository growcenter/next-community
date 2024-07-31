"use client";
import React from "react";
import { useQRCode } from "next-qrcode";

function TestQR() {
	const { Image } = useQRCode();

	return (
		<>
			<div className='w-1/2 mx-auto mt-5'>
				<Image
					text={"https://github.com/bunlong/next-qrcode"}
					options={{
						type: "image/jpeg",
						quality: 0.8,
						errorCorrectionLevel: "M",
						margin: 3,
						scale: 8,
						width: 200,
						color: {
							dark: "#000000",
							light: "#FFFFFF",
						},
					}}
				/>
			</div>
		</>
	);
}

export default TestQR;

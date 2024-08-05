// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-800 text-white p-5 mt-auto w-full">
			<div className="container mx-auto text-center">
				<p className="text-xs md:text-sm">
					For any issues or questions, please contact our{" "}
					<a
						href="https://www.instagram.com/growcenterchurch/"
						className="text-blue-400 hover:underline"
					>
						Instagram
					</a>
					.
				</p>
			</div>
		</footer>
	);
};

export default Footer;

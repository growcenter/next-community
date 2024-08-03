// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
	return (
		<div className=" bg-gray-800 text-white py-4 mt-10">
			<div className="container mx-auto text-center">
				<p className="text-sm">
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
		</div>
	);
};

export default Footer;

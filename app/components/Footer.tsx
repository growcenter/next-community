// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
	return (
		<div className=" bg-gray-800 text-white py-8 mt-10">
			<div className="mx-auto text-center">
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
		</div>
	);
};

export default Footer;

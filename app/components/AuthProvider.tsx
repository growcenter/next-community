"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (data: any) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			const userData = localStorage.getItem("userData");
			if (userData) {
				const token = JSON.parse(userData).token;
				const isValid = await validateToken(token);
				if (isValid) {
					setIsAuthenticated(true);
				} else {
					handleLogout();
				}
			} else {
				setIsAuthenticated(false);
			}
		};
		checkAuth();
	}, []);

	const validateToken = async (token: string) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validate-token`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
						"X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
					},
				}
			);
			if (response.status === 401) {
				return false; // Token is expired
			}
			return response.ok; // Token is valid
		} catch (error) {
			console.error("Token validation failed:", error);
			return false; // Default to invalid token
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("userData");
		setIsAuthenticated(false);
		router.push("/login"); // Redirect to login page or any other page
		alert("Your session has expired. Please log in again.");
	};

	const login = (data: any) => {
		localStorage.setItem("userData", JSON.stringify(data));
		setIsAuthenticated(true);
	};

	const logout = () => {
		handleLogout(); // Use the same logout logic for consistency
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

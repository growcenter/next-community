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
		const userData = localStorage.getItem("userData");
		setIsAuthenticated(!!userData);
	}, []);

	const login = (data: any) => {
		localStorage.setItem("userData", JSON.stringify(data));
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("userData");
		setIsAuthenticated(false);
		router.push("/");
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

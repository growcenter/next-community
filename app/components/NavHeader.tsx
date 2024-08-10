"use client";
import { useState } from "react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/app/components/ui/navigation-menu";
import { CiHome } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "./AuthProvider";

interface NavHeaderProps {
	children: ReactNode;
}

export const NavHeader: React.FC<NavHeaderProps> = ({ children }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { isAuthenticated, logout } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<>
			<nav className="container">
				<div className="container mx-auto px-3 py-4 flex items-center justify-between">
					<div className="flex items-center">
						<Link href="/" legacyBehavior passHref>
							<a className="text-xl font-bold flex items-center">
								<CiHome className="w-7 h-6 mr-2" />
								GROW
							</a>
						</Link>
					</div>
					<div className="hidden md:flex space-x-4">
						<NavigationMenu>
							<NavigationMenuList>
								{isAuthenticated ? (
									<>
										{userData.role === "admin" ? (
											<>
												<NavigationMenuItem>
													<Link href="/dashboard" legacyBehavior passHref>
														<NavigationMenuLink
															className={navigationMenuTriggerStyle()}
														>
															Dashboard
														</NavigationMenuLink>
													</Link>
												</NavigationMenuItem>
												<NavigationMenuItem>
													<Link href="/profile" legacyBehavior passHref>
														<NavigationMenuLink
															className={navigationMenuTriggerStyle()}
														>
															My Profile
														</NavigationMenuLink>
													</Link>
												</NavigationMenuItem>
												<NavigationMenuItem>
													<Link href="/events" legacyBehavior passHref>
														<NavigationMenuLink
															className={navigationMenuTriggerStyle()}
														>
															Events
														</NavigationMenuLink>
													</Link>
												</NavigationMenuItem>
											</>
										) : userData.role === "usher" ? (
											<></>
										) : (
											<>
												<NavigationMenuItem>
													<Link href="/profile" legacyBehavior passHref>
														<NavigationMenuLink
															className={navigationMenuTriggerStyle()}
														>
															My Profile
														</NavigationMenuLink>
													</Link>
												</NavigationMenuItem>
												<NavigationMenuItem>
													<Link href="/events" legacyBehavior passHref>
														<NavigationMenuLink
															className={navigationMenuTriggerStyle()}
														>
															Events
														</NavigationMenuLink>
													</Link>
												</NavigationMenuItem>
											</>
										)}
										<NavigationMenuItem>
											<Button onClick={handleLogout}>Logout</Button>
										</NavigationMenuItem>
									</>
								) : (
									<>
										<NavigationMenuItem>
											<Link href="/register" legacyBehavior passHref>
												<NavigationMenuLink
													className={navigationMenuTriggerStyle()}
												>
													Register
												</NavigationMenuLink>
											</Link>
										</NavigationMenuItem>
										<NavigationMenuItem>
											<Link href="/login" legacyBehavior passHref>
												<NavigationMenuLink
													className={navigationMenuTriggerStyle()}
												>
													Login
												</NavigationMenuLink>
											</Link>
										</NavigationMenuItem>
									</>
								)}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="text-2xl"
						>
							{isMobileMenuOpen ? <FiX /> : <FiMenu />}
						</button>
					</div>
				</div>
				{isMobileMenuOpen && (
					<NavigationMenu>
						<NavigationMenuList className="md:hidden flex flex-row justify-evenly mb-3">
							{isAuthenticated ? (
								<>
									{userData.role === "admin" ? (
										<>
											<NavigationMenuItem>
												<Link href="/dashboard" legacyBehavior passHref>
													<NavigationMenuLink
														className={navigationMenuTriggerStyle()}
													>
														Dashboard
													</NavigationMenuLink>
												</Link>
											</NavigationMenuItem>
											<NavigationMenuItem>
												<Link href="/profile" legacyBehavior passHref>
													<NavigationMenuLink
														className={navigationMenuTriggerStyle()}
													>
														My Profile
													</NavigationMenuLink>
												</Link>
											</NavigationMenuItem>
											<NavigationMenuItem>
												<Link href="/events" legacyBehavior passHref>
													<NavigationMenuLink
														className={navigationMenuTriggerStyle()}
													>
														Events
													</NavigationMenuLink>
												</Link>
											</NavigationMenuItem>
										</>
									) : userData.role === "usher" ? (
										<></>
									) : (
										<>
											<NavigationMenuItem>
												<Link href="/profile" legacyBehavior passHref>
													<NavigationMenuLink
														className={navigationMenuTriggerStyle()}
													>
														My Profile
													</NavigationMenuLink>
												</Link>
											</NavigationMenuItem>
											<NavigationMenuItem>
												<Link href="/events" legacyBehavior passHref>
													<NavigationMenuLink
														className={navigationMenuTriggerStyle()}
													>
														Events
													</NavigationMenuLink>
												</Link>
											</NavigationMenuItem>
										</>
									)}
									<NavigationMenuItem>
										<Button onClick={handleLogout}>Logout</Button>
									</NavigationMenuItem>
								</>
							) : (
								<>
									<NavigationMenuItem>
										<Link href="/register" legacyBehavior passHref>
											<NavigationMenuLink
												className={navigationMenuTriggerStyle()}
											>
												Register
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<Link href="/login" legacyBehavior passHref>
											<NavigationMenuLink
												className={navigationMenuTriggerStyle()}
											>
												Login
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</>
							)}
						</NavigationMenuList>
					</NavigationMenu>
				)}
			</nav>
			{children}
		</>
	);
};

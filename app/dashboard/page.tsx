"use client";
import { useState } from "react";
import Link from "next/link";
import {
	Calendar,
	LucideQrCode,
	Package,
	Users,
	LineChart,
	Menu,
	Search,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import EventSummary from "../components/EventSummary";
import VerifyTicketPage from "../components/VerifyTicketPage";
import withAuth from "../components/AuthWrapper";
import { QrCode } from "lucide-react";

// Dummy components for illustration
const Events = () => <div>Events Component</div>;
const Orders = () => <div>Orders Component</div>;
const Products = () => <div>Products Component</div>;
const Customers = () => <div>Customers Component</div>;
const Analytics = () => <div>Analytics Component</div>;

function Dashboard() {
	const [selectedComponent, setSelectedComponent] = useState("Products");

	const renderComponent = () => {
		switch (selectedComponent) {
			case "Events":
				return <EventSummary />;
			case "Scanner":
				return <VerifyTicketPage />;
			case "Products":
				return <Products />;
			case "Customers":
				return <Customers />;
			case "Analytics":
				return <Analytics />;
			default:
				return <Products />;
		}
	};

	return (
		<div className="mt-5 grid min-h-screen  h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
				<div className="flex h-full min-h-screen flex-col gap-2">
					<div className="flex-1">
						<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
							<button
								onClick={() => setSelectedComponent("Events")}
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<Calendar className="h-4 w-4" />
								Events
							</button>
							<button
								onClick={() => setSelectedComponent("Scanner")}
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<LucideQrCode className="h-4 w-4" />
								Scanner
							</button>
							<button
								onClick={() => setSelectedComponent("Products")}
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<Package className="h-4 w-4" />
								Products
							</button>
							<button
								onClick={() => setSelectedComponent("Customers")}
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<Users className="h-4 w-4" />
								Customers
							</button>
							<button
								onClick={() => setSelectedComponent("Analytics")}
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<LineChart className="h-4 w-4" />
								Analytics
							</button>
						</nav>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 md:hidden"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<nav className="grid gap-2 text-lg font-medium">
								<button
									onClick={() => setSelectedComponent("Events")}
									className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<Calendar className="h-5 w-5" />
									Events
								</button>
								<button
									onClick={() => setSelectedComponent("Scanner")}
									className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<LucideQrCode className="h-5 w-5" />
									Scanner
								</button>
								<button
									onClick={() => setSelectedComponent("Products")}
									className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<Package className="h-5 w-5" />
									Products
								</button>
								<button
									onClick={() => setSelectedComponent("Customers")}
									className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<Users className="h-5 w-5" />
									Customers
								</button>
								<button
									onClick={() => setSelectedComponent("Analytics")}
									className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<LineChart className="h-5 w-5" />
									Analytics
								</button>
							</nav>
						</SheetContent>
					</Sheet>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{renderComponent()}
				</main>
			</div>
		</div>
	);
}

export default withAuth(Dashboard);

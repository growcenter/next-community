import { useState, useEffect } from "react";
import { Label, Pie, PieChart } from "recharts";
import { TrendingUp } from "lucide-react";
import { useAuth } from "./AuthProvider";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../components/ui/accordion";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "../components/ui/chart";

// Define chart configuration
const chartConfig = {
	visitors: {
		label: "Seats",
	},
} satisfies ChartConfig;

export default function EventSummary() {
	const [sessionData, setSessionData] = useState<any[]>([]);
	const { isAuthenticated, handleExpiredToken } = useAuth();
	const userData = isAuthenticated
		? JSON.parse(localStorage.getItem("userData") || "{}")
		: null;

	useEffect(() => {
		// Fetch API data
		fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/internal/events/registrations/E01/summary`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
					Authorization: `Bearer ${userData.token}`,
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				setSessionData(data.data); // Assuming 'data.data' contains the sessions
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const renderCharts = (session: any) => {
		const totalSeatsData = [
			{ name: "Registered", value: session.registeredSeats, fill: "#00C49F" },
			{ name: "Available", value: session.availableSeats, fill: "#FF8042" },
		];

		const scannedData = [
			{ name: "Scanned", value: session.registeredSeats, fill: "#0088FE" },
			{
				name: "Unscanned",
				value: session.availableSeats,
				fill: "#FFBB28",
			},
		];

		return (
			<div className='flex flex-col md:flex-row gap-4'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px] flex-1'
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={totalSeatsData}
							dataKey='value'
							nameKey='name'
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-3xl font-bold'
												>
													{session.registeredSeats + session.availableSeats}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'
												>
													Total Seats
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px] flex-1'
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={scannedData}
							dataKey='value'
							nameKey='name'
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-3xl font-bold'
												>
													{session.scannedSeats + session.unscannedSeats}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'
												>
													Scanned Seats
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</div>
		);
	};

	return (
		<Accordion type='single' collapsible className='w-full'>
			{sessionData.map((session) => (
				<AccordionItem key={session.code} value={session.code}>
					<AccordionTrigger>{session.name}</AccordionTrigger>
					<AccordionContent>
						<Card className='flex flex-col'>
							<CardHeader className='items-center pb-0'>
								<CardTitle>{session.name}</CardTitle>
								<CardDescription>{session.description}</CardDescription>
							</CardHeader>
							<CardContent className='flex-1 pb-0'>
								{renderCharts(session)}
							</CardContent>
							<CardFooter className='flex-col gap-2 text-sm'>
								<div className='leading-none text-muted-foreground'>
									Showing data for total and scanned seats
								</div>
							</CardFooter>
						</Card>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}

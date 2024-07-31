export interface EventSession {
	id: number;
	code: string;
	name: string;
	eventCode: string;
	description: string;
	time: string;
	maxSeating: number;
	availableSeats: number;
	registeredSeats: number;
	scannedSeats: number;
	status: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

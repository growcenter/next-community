export interface EventRegistration {
	type: string;
	name: string;
	identifier: string;
	address: string;
	accountNumber?: string;
	code: string;
	eventCode: string;
	eventName: string;
	sessionCode: string;
	sessionName: string;
	status: string;
	otherRegister?: { name: string; address: string }[];
	registeredBy?: string;
}

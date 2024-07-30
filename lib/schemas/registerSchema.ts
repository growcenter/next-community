import { z } from "zod";
import validator from "validator";

export const userSchema = z
	.object({
		name: z.string().min(1, "Type in your full name."),
		email: z
			.string()
			.optional()
			.refine(
				(value) => !value || validator.isEmail(value),
				"Please type in a valid email address!"
			),
		phoneNumber: z
			.string()
			.optional()
			.refine(
				(value) => !value || validator.isMobilePhone(value),
				"Please type in a valid mobile phone!"
			),
		password: z.string().min(6, "Password must be at least 6 characters long"),
	})
	.refine((data) => data.email || data.phoneNumber, {
		message: "Either email or phone number must be filled!",
		path: ["email"], // You can set this to email or phoneNumber
	});

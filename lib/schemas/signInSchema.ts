import { z } from "zod";

export const signInSchema = z.object({
	identifier: z.string().min(1, "Type in your email or phone number."),
	password: z.string().min(6, "Invalid password, try again!"),
});

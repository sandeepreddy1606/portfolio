import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "That name is unusually long."),
  email: z.string().trim().email("That doesn't look like a valid email address.").max(160),
  subject: z
    .string()
    .trim()
    .min(3, "Give the message a subject.")
    .max(120, "Keep the subject under 120 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a bit more — 20 characters minimum.")
    .max(4000, "That's over the 4000 character limit."),
  /** Honeypot: real users never see this field, so anything in it is a bot. */
  website: z.string().max(0).optional(),
});

export type ContactSchema = z.infer<typeof contactSchema>;

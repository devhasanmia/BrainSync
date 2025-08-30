import z from "zod";
import { colors, days } from "./classSchedule.constent";

export const classScheduleValidationSchema = z.object({
    subject: z
        .string({ error: "Subject is required" })
        .min(1, { error: "Subject is required" }),
    instructor: z
        .string({ error: "Instructor is required" })
        .min(1, { error: "Instructor is required" }),
    day: z.enum(days).optional(),
    startTime: z
        .string({ error: "Start time is required" })
        .min(1, { error: "Start time is required" }),
    endTime: z
        .string({ error: "End time is required" })
        .min(1, { error: "End time is required" }),
    location: z.string().optional(),
    color: z.enum(colors).optional(),
});

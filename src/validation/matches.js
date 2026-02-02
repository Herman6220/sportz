import { z } from "zod";

// Constants
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

// Query schema for listing matches
export const listMatchesQuerySchema = z.object({
  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

// Params schema for match id
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Helper to validate ISO date strings
const isoDateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date string",
  });

// Schema for creating a match
export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),
    startTime: isoDateStringSchema,
    endTime: isoDateStringSchema,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start = Date.parse(data.startTime);
    const end = Date.parse(data.endTime);

    if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
      ctx.addIssue({
        path: ["endTime"],
        message: "endTime must be after startTime",
        code: z.ZodIssueCode.custom,
      });
    }
  });

// Schema for updating scores
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});

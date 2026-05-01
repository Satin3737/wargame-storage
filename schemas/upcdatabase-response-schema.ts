import {z} from 'zod';

export const upcDatabaseResponseSchema = z.object({
    title: z.string().optional()
});

export type IUpcDatabaseResponse = z.infer<typeof upcDatabaseResponseSchema>;

import {z} from 'zod';

export const goUpcResponseSchema = z.object({
    code: z
        .object({
            name: z.string().optional()
        })
        .optional()
});

export type IGoUpcResponse = z.infer<typeof goUpcResponseSchema>;

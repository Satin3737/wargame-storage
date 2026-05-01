import {z} from 'zod';

export const upcResponseSchema = z.object({
    code: z.string().optional(),
    items: z
        .array(
            z.object({
                title: z.string().optional(),
                brand: z.string().optional()
            })
        )
        .optional()
});

export type IUpcResponse = z.infer<typeof upcResponseSchema>;

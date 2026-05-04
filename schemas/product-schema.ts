import {z} from 'zod';
import {CategoryValues} from '@/constants';

export const productFormSchema = z.object({
    name: z.string().trim().min(2, 'Минимум 2 символа').max(480, 'Максимум 480 символов'),
    qty: z.number('Введите целое число').int('Введите целое число').min(0, 'Не меньше 0').max(999999, 'Слишком много'),
    category: z.enum(CategoryValues),
    photoBlob: z.instanceof(Blob).nullable(),
    barcode: z.string().trim().max(64).nullable(),
    isPriceReduction: z.boolean(),
    isUsed: z.boolean()
});

export type IProductFormValues = z.infer<typeof productFormSchema>;

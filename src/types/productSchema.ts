import { z } from 'zod';

export const productSchema = z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
    description: z.string().min(10, "La description doit faire au moins 10 caractères"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Le prix doit être un nombre positif",
    }),
});

export type ProductFormData = z.infer<typeof productSchema>;
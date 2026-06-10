import { z } from 'zod';

export enum PROFILE_TYPE { SELLER = 'seller', USER = 'user' }

export const authSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
  username: z.string().min(3, "Trop court"),
  type: z.enum(PROFILE_TYPE), // Validation stricte sur l'enum
});
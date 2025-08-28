import { z, ZodType, ZodError } from 'zod';
import { Response } from '../../utils/types';


export function validate<T>(schema: ZodType<T>, data: any): Response<T> {
    try {
        const parsed = schema.parse(data);

        return {
            success: true,
            message: 'Validation successful!',
            statusCode: 200,
            data: parsed
        };

    } catch (error: any) {
        const err = error as ZodError;
        return {
            success: false,
            message: 'Validation error!',
            statusCode: 400,
            error: { errors: err.issues }
        };
    }
}


/**
 * ===========================================================================================
 * CREATE USER PAYLOAD
 * ===========================================================================================
 */
export const createUserPayload = z.object({
    name: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .toUpperCase()
        .transform((val) => val.replace(/\s+/g, ' ')),

    username: z
        .email()
        .trim()
        .max(50)
        .toLowerCase(),

    password: z
        .string()
        .min(8, { message: 'The password must be at least 8 characters long!' })
        .max(20, { message: 'The password must be at most 20 characters long!' })
        .refine((val) => /[a-z]/.test(val), { message: 'The password must contain at least one lowercase letter!' })
        .refine((val) => /[A-Z]/.test(val), { message: 'The password must contain at least one uppercase letter!' })
        .refine((val) => /[0-9]/.test(val), { message: 'The password must contain at least one number!' })
        .refine((val) => /[^A-Za-z0-9]/.test(val), { message: 'The password must contain at least one special character!' })
        .refine((val) => !/\s/.test(val), { message: 'The password cannot contain spaces!' }),
});
export type CreateUserPayloadDTO = z.infer<typeof createUserPayload>;


/**
 * ===========================================================================================
 * AUTH USER PAYLOAD
 * ===========================================================================================
 */
export const authUserPayload = createUserPayload.pick({ username: true }).extend({ password: z.string().max(100) });
export type AuthUserPayloadDTO = z.infer<typeof authUserPayload>;
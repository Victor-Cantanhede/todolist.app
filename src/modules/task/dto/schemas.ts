import { z } from 'zod';


/**
 * ===========================================================================================
 * CREATE TASK PAYLOAD
 * ===========================================================================================
 */
export const createTaskPayload = z.object({
    title: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .toUpperCase()
        .transform((val) => val.replace(/\s+/g, ' ')),

    description: z
        .string()
        .trim()
        .max(500),
});
export type CreateTaskPayloadDTO = z.infer<typeof createTaskPayload>;


/**
 * ===========================================================================================
 * UPDATE TASK PAYLOAD
 * ===========================================================================================
 */
export const updateTaskPayload = createTaskPayload.pick({
    title: true,
    description: true
})
.extend({
    status: z.boolean()
});
export type UpdateTaskPayloadDTO = z.infer<typeof updateTaskPayload>;
import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller } from '../utils/Controller';
import { validate } from '../utils/validateZodSchema';
import { ResponseUserToken } from '@modules/utils/types';
import { createTaskPayload, CreateTaskPayloadDTO, updateTaskPayload, UpdateTaskPayloadDTO } from './dto/schemas';
import { taskService } from './services';


export class TaskController extends Controller {

    // CREATE TASK
    async createTask(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<CreateTaskPayloadDTO>(createTaskPayload, req.body);
            if (!payload.success) return payload;

            return await taskService.createTask(req.user as ResponseUserToken, payload.data as CreateTaskPayloadDTO);
        });
    }


    // GET ALL TASKS
    async getAllTasks(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            return await taskService.getAllTasks(req.user as ResponseUserToken);
        });
    }


    // UPDATE TASK
    async updateTask(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        return this.request(req, res, async () => {

            const taskId = Number(req.params.id);

            const payload = validate<UpdateTaskPayloadDTO>(updateTaskPayload, req.body);
            if (!payload.success) return payload;

            return await taskService.updateTask({
                user: req.user as ResponseUserToken,
                taskId: taskId,
                newTaskData: payload.data as UpdateTaskPayloadDTO
            });
        });
    }

    // DELETE TASK
    // async deleteTask(req: FastifyRequest, res: FastifyReply) {
    //     return this.request(req, res, async () => {

    //         //
    //     });
    // }
}
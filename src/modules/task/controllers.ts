import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller } from '../utils/Controller';
import { validate } from '../utils/validateZodSchema';
import { ResponseUserToken } from '@modules/utils/types';
import { createTaskPayload, CreateTaskPayloadDTO } from './dto/schemas';
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
}
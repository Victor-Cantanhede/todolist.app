import { prisma } from '../../lib/prisma/db';
import { Service } from '@modules/utils/Service';
import { response } from '@modules/utils/Controller';
import { ResponseUserToken } from '@modules/utils/types';
import { CreateTaskPayloadDTO, UpdateTaskPayloadDTO } from './dto/schemas';


class TaskService extends Service {

    /**
     * ===========================================================================================
     * CREATE TASK
     * ===========================================================================================
     */
    async createTask(user: ResponseUserToken, newTaskData: CreateTaskPayloadDTO) {
        return this.execute(async () => {

            // ===========================================================================================
            const existingTask = await prisma.tasks.findUnique({
                where: {
                    userId_title: {
                        userId: user.id,
                        title: newTaskData.title
                    }
                }
            });

            if (existingTask) {
                return response.error({ message: 'A task with the same name already exists!' });
            }

            // ===========================================================================================
            const newTask = await prisma.tasks.create({
                data: { ...newTaskData, userId: user.id },
                select: { id: true, title: true, description: true, status: true, createdAt: true }
            });

            // ===========================================================================================
            return response.success({
                message: 'Task registered succesfully!',
                statusCode: 201,
                data: { newTask }
            });
        });
    }


    /**
     * ===========================================================================================
     * GET ALL TASKS
     * ===========================================================================================
     */
    async getAllTasks(user: ResponseUserToken) {
        return this.execute(async () => {

            // ===========================================================================================
            const tasks = await prisma.tasks.findMany({ where: { userId: user.id } });

            return response.success({
                message: 'Consultation carried out successfully!',
                data: tasks
            });
        });
    }


    /**
     * ===========================================================================================
     * UPDATE TASK
     * ===========================================================================================
     */
    async updateTask({ user, taskId, newTaskData }: {
        user: ResponseUserToken,
        taskId: number,
        newTaskData: UpdateTaskPayloadDTO

    }) {
        return this.execute(async () => {

            // ===========================================================================================
            const task = await prisma.tasks.findUnique({
                where: {
                    id: taskId,
                    userId: user.id
                }
            });

            if (!task) {
                return response.error({ message: 'Task not found!' });
            }

            // ===========================================================================================
            const existingTask = await prisma.tasks.findUnique({
                where: {
                    userId_title: {
                        userId: user.id,
                        title: newTaskData.title
                    }
                }
            });

            if (existingTask && existingTask.id !== task.id) {
                return response.error({ message: 'A task with the same name already exists!' });
            }

            // ===========================================================================================
            const updatedTask = await prisma.tasks.update({
                where: { id: task.id },
                data: { ...newTaskData }
            });

            // ===========================================================================================
            return response.success({
                message: 'Task updated successfully!',
                data: { updatedTask }
            });
        });
    }


    /**
     * ===========================================================================================
     * DELETE TASK
     * ===========================================================================================
     */
    async deleteTask(user: ResponseUserToken, taskId: number) {
        return this.execute(async () => {

            // ===========================================================================================
            const task = await prisma.tasks.findUnique({
                where: {
                    id: taskId,
                    userId: user.id
                }
            });

            if (!task) {
                return response.error({ message: 'Task not found!' });
            }

            // ===========================================================================================
            const deletedTask = await prisma.tasks.delete({ where: { id: task.id } });

            // ===========================================================================================
            return response.success({
                message: 'Task deleted successfully!',
                data: { deletedTask }
            });
        });
    }
}

export const taskService = new TaskService();
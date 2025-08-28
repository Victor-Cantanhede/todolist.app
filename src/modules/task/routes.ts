import { FastifyInstance } from 'fastify';
import { onlyAuthenticated } from 'middlewares/authMiddleware';
import { TaskController } from './controllers';


export async function taskRoutes(app: FastifyInstance) {
    const controller = new TaskController();

    app.post('/create', { preHandler: onlyAuthenticated }, (req, res) => controller.createTask(req, res));
    app.get('/get-all', { preHandler: onlyAuthenticated }, (req, res) => controller.getAllTasks(req, res));
}
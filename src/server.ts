import { FRONT_URL, JWT_SECRET, NODE_ENV, PORT } from './config/env';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';

import { userRoutes } from './modules/user/routes';
import { taskRoutes } from './modules/task/routes';


async function bootstrap() {
    const app = Fastify();

    // CONFIG CORS
    await app.register(fastifyCors, {
        origin: FRONT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });

    // CONFIG JWT
    app.register(fastifyCookie, { secret: JWT_SECRET });

    // REQUEST TEST
    app.get('/', (req, res) => {
        console.log('New connection detected!');
        res.status(200).send({ message: 'Server connected!' });
    });

    // ROUTES
    app.register(userRoutes, { prefix: '/users' });
    app.register(taskRoutes, { prefix: '/tasks' });

    app.listen({ port: PORT }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server running on ${address} in ${NODE_ENV}`);
    });
}
bootstrap();
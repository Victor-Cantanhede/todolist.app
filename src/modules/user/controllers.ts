import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller } from '../utils/Controller';
import { validate } from '../utils/validateZodSchema';
import { userService } from './services';
import {
    authUserPayload,
    AuthUserPayloadDTO,
    createUserPayload,
    CreateUserPayloadDTO

} from './dto/schemas';


export class UserController extends Controller {

    // CREATE USER
    async createUser(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<CreateUserPayloadDTO>(createUserPayload, req.body);
            if (!payload.success) return payload;

            return await userService.createUser(payload.data as CreateUserPayloadDTO);
        });
    }


    // AUTH USER
    async authUser(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<AuthUserPayloadDTO>(authUserPayload, req.body);
            if (!payload.success) return payload;

            const response = await userService.authUser(payload.data as AuthUserPayloadDTO);
            if (!response.success) return response;

            res.setCookie('token', response.data.token as string, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        });
    }
}
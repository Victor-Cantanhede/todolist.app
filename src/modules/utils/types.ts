import 'fastify';


// Must be the same type of ResponseUserToken
declare module 'fastify' {
    interface FastifyRequest {
        user?: ResponseUserToken;
    }
}

export interface Response<T = any> {
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
    error?: any;
}

export type ResponseUserToken = {
    id: number;
    name: string;
    username: string;
    status: boolean;
};
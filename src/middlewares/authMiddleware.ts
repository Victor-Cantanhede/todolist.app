import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseUserToken } from '../modules/utils/types';


async function authMiddleware(req: FastifyRequest, res: FastifyReply) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send({ success: false, error: 'Unauthenticated user! Please log in and try again.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = decoded as ResponseUserToken;

        if (!user.status) {
            return res.status(401).send({ success: false, error: 'Inactive or blocked user! Contact the administrator.' });
        }

        req.user = user;

    } catch (error) {
        return res.status(401).send({ success: false, error: 'Acesso negado! Token inválido ou expirado.' });
    }
}

export const onlyAuthenticated = [authMiddleware];
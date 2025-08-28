import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../../lib/prisma/db';
import { Service } from '@modules/utils/Service';
import { response } from '@modules/utils/Controller';
import { JWT_SECRET } from 'config/env';

import { AuthUserPayloadDTO, CreateUserPayloadDTO } from './dto/schemas';


class UserService extends Service {

    /**
     * ===========================================================================================
     * CREATE USER
     * ===========================================================================================
     */
    async createUser(newUserData: CreateUserPayloadDTO) {
        return this.execute(async () => {

            // ===========================================================================================
            const existingUser = await prisma.users.findUnique({ where: { username: newUserData.username } });

            if (existingUser) {
                return response.error({ message: 'Email already registered!' });
            }

            // ===========================================================================================
            const hashedPassword = await bcrypt.hash(newUserData.password, 10);

            const newUser = await prisma.users.create({
                data: { ...newUserData, password: hashedPassword },
                select: { id: true, username: true, name: true, createdAt: true }
            });

            // ===========================================================================================
            return response.success({
                message: 'User registered successfully!',
                statusCode: 201,
                data: { newUser }
            });
        });
    }


    /**
     * ===========================================================================================
     * AUTH USER
     * ===========================================================================================
     */
    async authUser(credentials: AuthUserPayloadDTO) {
        return this.execute(async () => {

            // ===========================================================================================
            const user = await prisma.users.findUnique({ where: { username: credentials.username } });

            if (!user) {
                return response.error({ message: 'Unregistered user, register your account!' });
            }

            // ===========================================================================================
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);

            if (!passwordMatch) {
                return response.error({ message: 'Invalid password!' });
            }

            // ===========================================================================================
            const { password, ...safeUserData } = user;
            const token = jwt.sign(safeUserData, JWT_SECRET, { expiresIn: '1d' });

            // ===========================================================================================
            return response.success({
                message: 'Login successful!',
                data: {
                    token: token,
                    user: safeUserData
                }
            });
        });
    }
}

export const userService = new UserService();
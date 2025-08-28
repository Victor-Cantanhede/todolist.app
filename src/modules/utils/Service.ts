import { Response } from './types';


export class Service {
    protected async execute(
        callback: () => Promise<Response>

    ): Promise<Response> {

        try {
            const response = await callback();
            return response;

        } catch (error: any) {
            return {
                success: false,
                message: 'Internal error!',
                statusCode: 500,
                error: error
            };
        }
    }
}
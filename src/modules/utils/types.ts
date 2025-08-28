

export interface Response<T = any> {
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
    error?: any;
}
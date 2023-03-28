import User from '../../models/User';
import { Request } from 'express';

declare namespace Express {
    export interface Request {
        user?: User;
    }
}

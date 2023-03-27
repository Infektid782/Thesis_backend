import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import controller from './User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';
import Logging from '../library/Logging';

const checkDuplicate = async (email: string, username: string) => {
    try {
        const checkEmail = await User.findOne({ email });
        const checkUsername = await User.findOne({ username });
        if (checkEmail || checkUsername) throw new Error('duplicate');
        return { status: 'success' };
    } catch (error) {
        if (error instanceof Error) {
            return { status: 'failed', message: error.message };
        } else {
            return { status: 'failed', message: 'unknown error' };
        }
    }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // request body should containt { email, username, password, fullName, birthday, phoneNumber, gender, pictureURL }
        const userData = req.body;
        const check = await checkDuplicate(userData.email, userData.username);
        if (check.status === 'failed') throw Error(check.message);
        // strong pw ??
        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await controller.createUser(userData);
        Logging.info(user);
        // check if failed user creation leads to falsy
        if (!user) throw Error('failed');
        const token = jwt.sign({ email: user.email, username: user.username }, config.jwt.secretKey);
        res.append('x-access-token', token);
        res.status(201).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'unknown error' });
        }
    }
};

const login = () => {};

export default { register, login };

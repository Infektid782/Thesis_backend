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
        if (checkEmail || checkUsername) throw new Error('User already exists!');
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
        const userData = req.body;
        if (!userData.email || !userData.username || !userData.password) throw Error('Missing data!');
        const check = await checkDuplicate(userData.email, userData.username);
        if (check.status === 'failed') throw Error(check.message);
        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await controller.createUser(userData);
        Logging.info(`Created: ${user}`);
        const token = jwt.sign({ username: user.username, password: user.password }, config.jwt.secretKey);
        res.append('x-access-token', token);
        res.status(201).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const user = await User.findOne({ username: userData.username });
        if (!user) throw Error('Username is incorrect!');
        const checkPassword = await bcrypt.compare(userData.password, user.password);
        if (!checkPassword) throw Error('Password is incorrect');
        const token = jwt.sign({ username: user.username, password: user.password }, config.jwt.secretKey);
        res.append('x-access-token', token);
        res.status(200).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'unknown error' });
        }
    }
};

export default { register, login };

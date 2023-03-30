import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Logging from '../library/Logging';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';

const createUser = async (userData: IUser) => {
    const { email, username, password, fullName, birthday, phoneNumber, gender, pictureURL } = userData;
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        username,
        password,
        fullName,
        birthday,
        phoneNumber,
        gender,
        pictureURL
    });
    Logging.info('Created: ' + user);
    return await user.save();
};

const readUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.username;
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found!');
        res.status(200).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'unknown error' });
        }
    }
};

const readAllUsers = (req: Request, res: Response, next: NextFunction) => {
    return User.find()
        .then((users) => res.status(200).json({ users }))
        .catch((error) => res.status(500).json({ error }));
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.username;
        Logging.info(username);
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found!');
        await user.set(req.body).save();
        Logging.info('Updated: ' + user);
        // Update password hash if password changed
        // Delete other token
        const token = jwt.sign({ username: user.username, password: user.password }, config.jwt.secretKey);
        res.append('x-access-token', token);
        res.status(200).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'unknown error' });
        }
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.username;
        const user = await User.deleteOne({ username });
        if (user.deletedCount === 0) throw new Error('User not found!');
        Logging.info('Deleted: ' + user);
        res.status(201).json({ message: 'Deleted user.' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'unknown error' });
        }
    }
};

export default { createUser, readUser, readAllUsers, updateUser, deleteUser };

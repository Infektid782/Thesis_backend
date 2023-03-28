import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Logging from '../library/Logging';

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
    Logging.info(user);
    return await user.save();
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.userID;

    return User.findById(userID)
        .then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAllUsers = (req: Request, res: Response, next: NextFunction) => {
    return User.find()
        .then((users) => res.status(200).json({ users }))
        .catch((error) => res.status(500).json({ error }));
};
const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.userID;
    return User.findById(userID)
        .then((user) => {
            if (user) {
                user.set(req.body);
                return user
                    .save()
                    .then((user) => res.status(201).json({ user }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.username;
        const user = await User.deleteOne({ username });
        if (!user) throw new Error(' Not found');
        res.status(201).json({ message: 'Deleted' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ error });
        } else {
            res.status(500).json({ message: 'unknown error' });
        }
    }
};

export default { createUser, readUser, readAllUsers, updateUser, deleteUser };

import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Group, { IGroup } from '../models/Group';
import Logging from '../library/Logging';

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, eventIDs, members, owner, description, iconURL } = req.body;
        const group = new Group({
            _id: new mongoose.Types.ObjectId(),
            name,
            eventIDs,
            members,
            owner,
            description,
            iconURL
        });
        await group.save();
        Logging.info('Created: ' + group);
        res.status(201).json(group);
    } catch (error) {
        if (error instanceof Error) {
            Logging.err(error.message);
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const readGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupID = req.params.groupID;
        const group = await Group.findById(groupID);
        if (!group) throw new Error('Group not found!');
        res.status(200).json(group);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'unknown error' });
        }
    }
};

const readAllGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groups = await Group.find();
        if (!groups[0]) throw new Error('There are no groups!');
        res.status(200).json({ groups });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const readGroupsForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.username;
        const groups = await Group.find({ 'members.username': username });
        if (!groups[0]) throw new Error('This user has no events!');
        res.status(200).json({ groups });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupID = req.params.groupID;
        const group = await Group.findById(groupID);
        if (!group) throw new Error('Group not found');
        group.set(req.body).save();
        Logging.info('Updated: ' + group);
        res.status(201).json({ group });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupID = req.params.eventID;
        const group = await Group.findByIdAndDelete(groupID);
        if (!group) throw new Error('Group not found');
        Logging.info('Deleted: ' + group);
        res.status(201).json({ message: 'Deleted group!' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

export default { createGroup, readGroup, readAllGroups, readGroupsForUser, updateGroup, deleteGroup };

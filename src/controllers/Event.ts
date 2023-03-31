import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Logging from '../library/Logging';
import Event from '../models/Event';

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, group, users, date, repeat, location, description, iconURL } = req.body;
        const event = new Event({
            _id: new mongoose.Types.ObjectId(),
            name,
            group,
            users,
            date,
            repeat,
            location,
            description,
            iconURL
        });
        await event.save();
        Logging.info(`Created: ${event}`);
        res.status(201).json({ event });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const readEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventID = req.params.eventID;
        const event = await Event.findById(eventID);
        if (!event) throw new Error('Event not found!');
        res.status(200).json({ event });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const readAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find();
        if (!events[0]) throw new Error('There are no events!');
        res.status(200).json({ events });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const readEventsForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.username;
        const events = await Event.find({ 'users.username': username });
        if (!events[0]) throw new Error('This user has no events!');
        res.status(200).json({ events });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const readEventsForGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupName = req.params.groupName;
        const events = await Event.find({ group: groupName });
        if (!events[0]) throw new Error('There are no events for this group!');
        res.status(200).json({ events });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventID = req.params.eventID;
        const event = await Event.findById(eventID);
        if (!event) throw new Error('Event not found');
        event.set(req.body).save();
        Logging.info('Updated: ' + event);
        res.status(201).json({ event });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventID = req.params.eventID;
        const event = await Event.findByIdAndDelete(eventID);
        if (!event) throw new Error('Event not found');
        Logging.info('Deleted: ' + event);
        res.status(201).json({ message: 'Deleted event!' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error!' });
        }
    }
};

export default { createEvent, readEvent, readAllEvents, readEventsForUser, readEventsForGroup, updateEvent, deleteEvent };

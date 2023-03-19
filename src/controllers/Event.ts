import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';

const createEvent = (req: Request, res: Response, next: NextFunction) => {
    const { name, group, date, repeat, location, description, iconURL } = req.body;
    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        name,
        group,
        date,
        repeat,
        location,
        description,
        iconURL
    });

    return event
        .save()
        .then((event) => res.status(201).json({ event }))
        .catch((error) => res.status(500).json({ error }));
};

const readEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventID = req.params.eventID;

    return Event.findById(eventID)
        .then((event) => (event ? res.status(200).json({ event }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAllEvents = (req: Request, res: Response, next: NextFunction) => {
    return Event.find()
        .then((events) => res.status(200).json({ events }))
        .catch((error) => res.status(500).json({ error }));
};
const updateEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventID = req.params.eventID;

    return Event.findById(eventID)
        .then((event) => {
            if (event) {
                event.set(req.body);
                return event
                    .save()
                    .then((event) => res.status(201).json({ event }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventID = req.params.eventID;

    return Event.findByIdAndDelete(eventID)
        .then((event) => (event ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createEvent, readEvent, readAllEvents, updateEvent, deleteEvent };

import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent {
    name: string;
    group: string;
    date: string;
    repeat: string;
    location: string;
    description: string;
    iconURL: string;
}

export interface IEventModel extends IEvent, Document {}

const EventSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        group: { type: String, required: true },
        date: { type: String, required: true },
        repeat: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true },
        iconURL: { type: String, required: false }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IEventModel>('Event', EventSchema);

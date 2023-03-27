import mongoose, { Document, Schema } from 'mongoose';

//rename
export type UserResponse = 'invited' | 'attending' | 'missing';
export interface IInvitedUsers {
    username: string;
    response: UserResponse;
}

export interface IEvent {
    name: string;
    group: string;
    users: IInvitedUsers[];
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
        // Array review!
        users: { type: [{ username: String, response: String }], required: false },
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

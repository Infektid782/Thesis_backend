import mongoose, { Document, Schema } from 'mongoose';

export type UserAttendance = 'invited' | 'attending' | 'missing';

export type Rank = 'owner' | 'admin' | 'member';

export interface IInvitedUser {
    username: string;
    attendance: UserAttendance;
    rank: Rank;
    profilePic: string;
}

export interface IEvent {
    name: string;
    group: string;
    users: IInvitedUser[];
    owner: string;
    date: string;
    repeat: string;
    location: string;
    iconURL: string;
}

export interface IEventModel extends IEvent, Document {}

const EventSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        group: { type: String, required: true },
        users: { type: [{ username: String, attendance: String, profilePic: String }], required: true },
        owner: { type: String, required: true },
        date: { type: String, required: true },
        repeat: { type: String, required: true },
        location: { type: String, required: true },
        iconURL: { type: String, required: false }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IEventModel>('Event', EventSchema);

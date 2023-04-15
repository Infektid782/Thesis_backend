import mongoose, { Document, Schema } from 'mongoose';

export type Rank = 'owner' | 'admin' | 'member';

export interface IMember {
    username: string;
    rank: Rank;
}

export interface IGroup {
    name: string;
    eventIDs: string[];
    members: IMember[];
    owner: string;
    description: string;
    iconURL: string;
}

export interface IGroupModel extends IGroup, Document {}

const GroupSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        eventIDs: { type: [String], required: false },
        members: { type: [{ username: String, rank: String }], required: true },
        owner: { type: String, required: true },
        description: { type: String, required: true },
        iconURL: { type: String, required: false }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IGroupModel>('Group', GroupSchema);

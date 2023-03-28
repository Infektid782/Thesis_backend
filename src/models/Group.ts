import mongoose, { Document, Schema } from 'mongoose';

export interface IMembers {
    username: string;
    rang: string;
}

export interface IGroup {
    name: string;
    events: string[];
    members: IMembers[];
    description: string;
    iconURL: string;
}

export interface IGroupModel extends IGroup, Document {}

const GroupSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        events: { type: [String], required: false },
        members: { type: [{ username: String, rang: String }], required: true },
        description: { type: String, required: false },
        iconURL: { type: String, required: false }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IGroupModel>('Group', GroupSchema);

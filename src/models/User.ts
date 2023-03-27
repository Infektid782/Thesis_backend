import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    email: string;
    username: string;
    password: string;
    fullName: string;
    birthday: string;
    phoneNumber: string;
    gender: string;
    pictureURL: string;
}

export type User = {
    email: string;
    username: string;
};

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        fullName: { type: String, required: false },
        birthday: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        gender: { type: String, required: false },
        pictureURL: { type: String, required: false }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);

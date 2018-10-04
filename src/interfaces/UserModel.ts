import { Document } from "mongoose"

export interface IUserDocument extends Document {
    userName: string
    passwordHash: string
    email: string
    password: string
}

export interface IUser extends IUserDocument {
    comparePassword(password: string): boolean; 
}

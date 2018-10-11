import { Document } from "mongoose"

export interface IUserDocument extends Document {
    userId: string
    userName: string
    passwordHash: string
    email: string
    password: string
    createdAt: string
    updatedAt: string
}

export interface IUser extends IUserDocument {
    comparePassword(password: string): boolean; 
}

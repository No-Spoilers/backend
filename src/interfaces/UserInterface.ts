import { Document } from "mongoose"

export interface IUser extends Document {
    userId: string
    userName: string
    passwordHash: string
    email: string
    password: string
    createdAt: string
    updatedAt: string
    
    comparePassword(password: string): boolean; 
}

// Compare to IItem if changing

import { Document } from "mongoose"

export interface UserModel extends Document {
    userName: string
    passwordHash: string
    email: string
    password: string

    validPassword (password: string): boolean
}

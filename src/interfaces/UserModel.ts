import { Document } from "mongoose"

export interface UserModel extends Document {
    user_name: string
    password: string
    email: string
}
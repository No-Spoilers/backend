import { Document } from "mongoose"

export interface UserModel extends Document {
    user_name: string
    encoded_password: string
    email: string
}
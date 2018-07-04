import { Schema, Model, model } from "mongoose";
import { UserModel } from "../interfaces/UserModel";

export var UserSchema: Schema = new Schema({
    user_name: {
        type: String, 
        required: true
    },
    encoded_password: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
})

export const User: Model<UserModel> = model<UserModel>("User", UserSchema)

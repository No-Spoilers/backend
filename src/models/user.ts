import { Schema, Model, model } from "mongoose";
import { UserModel } from "../interfaces/UserModel";
import bcrypt from 'bcryptjs'

export var UserSchema: Schema = new Schema({
    userName: {
        type: String, 
        required: true,
        unique: true
    },
    passwordHash: {
        type: String
    },
    email: {
        type: String, 
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

UserSchema.virtual('password').set(function(this: UserModel, password: string) {
    if (!password) throw new Error('password is a required field')
    this.passwordHash = bcrypt.hashSync(password, 12);
});

export const User: Model<UserModel> = model<UserModel>("User", UserSchema)

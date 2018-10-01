import { Schema, Model, model } from "mongoose";
import { UserModel } from "../interfaces/UserModel";
import bcrypt from 'bcryptjs'

export var UserSchema: Schema = new Schema({
    user_name: {
        type: String, 
        required: true
    },
    password: {
        type: String
    },
    email: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
})

UserSchema.pre<UserModel>('save', function (next) {
    if (!this.password) throw new Error('password is a required field')
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

export const User: Model<UserModel> = model<UserModel>("User", UserSchema)

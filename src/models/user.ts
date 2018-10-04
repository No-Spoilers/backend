import { Schema, Model, model } from "mongoose";
import { IUserDocument, IUser } from "../interfaces/UserModel";
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

UserSchema.virtual('password').set(function(this: IUserDocument, password: string) {
    if (!password) throw new Error('password is a required field')
    this.passwordHash = bcrypt.hashSync(password, 12);
});

UserSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compareSync(password, this.passwordHash);
};

export const User: Model<IUser> = model<IUser>("User", UserSchema)

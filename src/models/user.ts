import { Schema, Model, model } from "mongoose";
import { IUser } from "../interfaces/UserInterface";
import bcrypt from 'bcryptjs'

export var UserSchema: Schema = new Schema({
    userId: {
        type: String, //uuid
        required: true
    },
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

UserSchema.virtual('password').set(function(this: IUser, password: string) {
    if (!password) throw new Error('password is a required field')
    this.passwordHash = bcrypt.hashSync(password, 12);
});

UserSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compareSync(password, this.passwordHash);
};

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema)

export default UserModel

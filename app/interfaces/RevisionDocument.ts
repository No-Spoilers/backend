import { Document } from "mongoose"

export interface IRevisionDocument extends Document {
    text?: string
}
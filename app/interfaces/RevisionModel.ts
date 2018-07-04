import { Document } from "mongoose"

export interface IRevisionModel extends Document {
    text?: string
}
import { Document } from "mongoose"

export interface ItemModel extends Document {
    parent_item?: any
    title?: string
    text?: string
}
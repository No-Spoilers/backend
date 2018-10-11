import { Schema } from "mongoose";

export interface NewItem {
    title: string
    text: string
    parent_item?: Schema.Types.ObjectId | Schema.Types.ObjectId[]
    creator?: string | string[]
}

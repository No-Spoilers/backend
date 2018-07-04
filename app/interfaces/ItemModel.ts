import { Document } from "mongoose"
import { IRevisionModel } from "./RevisionModel";

export interface IItemModel extends Document {
    title: string
    parent_item?: any
    slug: string
    content?: IRevisionModel[]
    creator?: string[]
    methods?: any
}

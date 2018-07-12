import { Document } from "mongoose"
import { IRevisionDocument } from "./RevisionDocument";

export interface IItemDocument extends Document {
    title: string
    children?: any
    slug: string
    content?: IRevisionDocument[]
    creator?: string[]
    
    updateContent(slug: string, updateText: string): IItemDocument
}

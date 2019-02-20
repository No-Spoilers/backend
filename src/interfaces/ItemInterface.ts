import { Document, Model } from "mongoose"

export interface IRevision extends Document {
    text?: string
    added_by?: string
}

export interface IItem extends Document {
    title: string
    children?: any
    slug: string
    content?: IRevision[]
    creator?: string[]

    // properties and instance methods go here
}

export interface IItemModel extends Model<IItem> {
    updateContent(slug: string, updateText: string, addedBy: string): Promise<IItem>

    // static methods go here
}

// Compare to IUser if changing

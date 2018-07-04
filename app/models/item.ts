import { Schema, Model, model } from "mongoose";
import { IItemModel } from "../interfaces/ItemModel";
import { IRevisionModel } from "../interfaces/RevisionModel";
import { NewItem } from "../interfaces/NewItem";

var RevisionSchema: Schema = new Schema({
    text: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
})

// const Revision: Model<IRevisionModel> = model<IRevisionModel>("Revision", RevisionSchema)

export var ItemSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    creator: {
        type: [ String ],
        required: false
    },
    content: {
        type: [ RevisionSchema ],
        required: false
    },
    parent_item: {
        type: [ Schema.Types.ObjectId ], 
        required: false
    }
}, {
    timestamps: true
})


// function slugify (text: string): string
// {
//   return text.toString()
//     .replace(/\s+/g, '-')           // Replace spaces with -
//     .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
//     .replace(/\-\-+/g, '-')         // Replace multiple - with single -
//     .replace(/^-+/, '')             // Trim - from start of text
//     .replace(/-+$/, '');            // Trim - from end of text
// }

// ItemSchema.statics.createNewItem = function (newItem: NewItem) {
//     const newPost = new Item()
//     newPost.slug = slugify(newItem.title)
//     return newPost.save()
// }

// ItemSchema.methods.updateItem = function (slug: string, updateText: string) {
//     const newRevision = new Revision()
//     newRevision.text = updateText
//     return Item.findOneAndUpdate({slug}, {$push: {content: newRevision}})
// }

export const Item: Model<IItemModel> = model<IItemModel>("Item", ItemSchema)


import { Schema, model } from "mongoose";
import { IItem, IRevision, IItemModel } from "../interfaces/ItemInterface";

var RevisionSchema: Schema = new Schema({
    text: {
        type: String, 
        default: ""
    }
}, {
    timestamps: true
})

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
    children: {
        type: [ Schema.Types.ObjectId ], 
        required: false
    }
}, {
    timestamps: true
})

const Revision = model<IRevision>("Revision", RevisionSchema)

ItemSchema.statics.updateContent = function (slug: string, updateText: string) {
    const newRevision = new Revision()
    newRevision.text = updateText
    return ItemModel.findOneAndUpdate({slug}, {$push: {content: newRevision}}, { new: true })
}

export const ItemModel: IItemModel = model<IItem, IItemModel>("Item", ItemSchema)

export default ItemModel

import { Schema, Model, model, Document } from "mongoose";
import { ItemInterface as IItem } from "../interfaces/ItemInterface";
import { RevisionInterface as IRevision } from "../interfaces/RevisionInterface";
import { NewItem } from "../interfaces/NewItem";

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

ItemSchema.statics.updateContent = function (slug: string, updateText: string) {
    const newRevision = new Revision()
    newRevision.text = updateText
    return Item.findOneAndUpdate({slug}, {$push: {content: newRevision}}, { new:true })
}

interface itemModel extends IItem, Document {}
interface revisionModel extends IRevision, Document {}

interface itemModelStatic extends Model<itemModel> {
    updateContent(slug: string, updateText: string): Promise<IItem>
}

const Revision = model<revisionModel>("Revision", RevisionSchema)


export const Item = model<itemModel, itemModelStatic>("Item", ItemSchema)

import { Schema, Model, model } from "mongoose";
import { ItemModel } from "../interfaces/ItemModel";

export var ItemSchema: Schema = new Schema({
    parent_item: {
        type: Schema.Types.ObjectId, 
        required: false
    },
    title: {
        type: String, 
        required: false
    },
    text: {
        type: String, 
        required: false
    }
}, {
    timestamps: true
})

export const Item: Model<ItemModel> = model<ItemModel>("Item", ItemSchema)

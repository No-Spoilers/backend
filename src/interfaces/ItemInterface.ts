import { RevisionInterface } from "./RevisionInterface";

export interface ItemInterface {
    title: string
    children?: any
    slug: string
    content?: RevisionInterface[]
    creator?: string[]
}

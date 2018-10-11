import express from 'express'
import logger from "../lib/logger";
import { Item } from '../models/item';
import bodyParser from 'body-parser'
import { ItemInterface as IItem } from '../interfaces/ItemInterface';
import endpoints from '../config/routes';

function slugify (text: string): string
{
    return text.toString()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export default function setupItemRoutes (router: express.Router) {
    router.get(
        endpoints.GET_ROOT, 
        function getRootEndpoint (req, res) {
            logger.info(`GET_ROOT Request received`)
            return res.status(200).send(endpoints)
        }
    )

    router.get(
        endpoints.GET_ITEM_LIST,
        async function getItemListEndpoint (req, res) {
            logger.info(`GET_ITEM_LIST Request received`)
            try {
                const findResult = await Item.find({});
                logger.info(`found: ${findResult.length} items`);
                return res.status(200).send(findResult);
            }
            catch (err) {
                return res.status(500).send(err);
            }
    })

    router.get(
        endpoints.GET_ITEM_BY_SLUG, 
        async function getItemBySlug (req, res) {
            logger.info(`GET_ITEM_BY_SLUG Request received: ${JSON.stringify(req.params)}`)
            try {
                const findResult = await Item.findById(req.params.slug);
                logger.info(`findResult: ${JSON.stringify(findResult, null, 2)}`);
                return res.status(200).send(findResult);
            }
            catch (err) {
                return res.status(500).send(err);
            }
    })

    router.post(endpoints.POST_ITEM,
        bodyParser.json(),
        async function postItemEndpoint (req, res) {
            logger.info(`POST_ITEM Request received: ${JSON.stringify(req.body)}`)
            const newPost = new Item(req.body)
            newPost.slug = slugify(req.body.title)
            try {
                const result = await newPost.save();
                logger.info(`Item create result: ${JSON.stringify(result, null, 2)}`);
                res.status(201).send({ result });
            }
            catch (err) {
                logger.error(err);
                res.status(400).send({ err });
            }
    })

    router.post(
        endpoints.POST_CONTENT,
        bodyParser.json(),
        async function postContentEndpoint (req, res) {
            logger.info(`POST_CONTENT Request received: ${JSON.stringify(req.body)}`)
            try {
                const updatedItem = await Item.updateContent(req.params.slug, req.body.text);
                console.log('Update item result:', JSON.stringify(updatedItem, null, 4));
                return res.status(200).send(updatedItem);
            }
            catch (err) {
                logger.error(err);
                return res.status(400).send({ err });
            }
    })

    return router
}

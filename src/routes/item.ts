import express from 'express'
import logger from "../lib/logger";
import ItemModel from '../models/item';
import bodyParser from 'body-parser'
import endpoints from '../config/routes';
import auth from '../lib/auth';
import slug from '../lib/slug';


export default function setupItemRoutes (router: express.Router) {
    router.get(
        endpoints.GET_ROOT,
        auth.tokenCheck,
        function getRootEndpoint (req, res) {
            logger.info(`GET_ROOT Request received`, req)
            return res.status(200).send(endpoints)
        }
    )

    router.get(
        endpoints.GET_ITEM_LIST,
        auth.tokenCheck,
        async function getItemListEndpoint (req, res) {
            logger.info(`GET_ITEM_LIST Request received`)
            try {
                const findResult = await ItemModel.find({});
                logger.info(`found: ${findResult.length} items`, req);
                return res.status(200).send(findResult);
            }
            catch (err) {
                return res.status(500).send(err);
            }
    })

    router.get(
        endpoints.GET_ITEM_BY_SLUG,
        auth.tokenCheck,
        async function getItemBySlug (req, res) {
            logger.info(`GET_ITEM_BY_SLUG Request received`, req)
            try {
                const findResult = await ItemModel.findOne({slug: req.params.slug});
                logger.info(`findResult: ${JSON.stringify(findResult, null, 2)}`);
                return res.status(200).send(findResult);
            }
            catch (err) {
                return res.status(500).send(err);
            }
    })

    router.post(endpoints.POST_ITEM,
        bodyParser.json(),
        auth.tokenCheck,
        async function postItemEndpoint (req, res) {
            try {
            logger.info(`POST_ITEM Request received | req.body: ${JSON.stringify(req.body)}`, req)
                
                const newPost = req.body
            newPost.slug = slug.create(req.body.title)
                
                // Could not get mongoose to validate the unique slug, so must check manually
                const dupeCheck = await ItemModel.find({ slug: newPost.slug });
                if (dupeCheck.length > 0) {
                    return res.status(400).send({err:`An item with the address ${dupeCheck[0].slug} already exists.`})
                }

                const result = await ItemModel.create(newPost);
                logger.info(`Item create result: ${JSON.stringify(result, null, 2)}`);
                res.status(201).send(result);
            }
            catch (err) {
                logger.error(err);
                res.status(400).send({ err });
            }
    })

    router.post(
        endpoints.POST_CONTENT,
        bodyParser.json(),
        auth.tokenCheck,
        async function postContentEndpoint (req, res) {
            logger.info(`POST_CONTENT Request received | req.body: ${JSON.stringify(req.body)}`, req)
            try {
                const updatedItem = await ItemModel.updateContent(req.params.slug, req.body.text);
                logger.info(`Update ItemModel result: ${JSON.stringify(updatedItem)}`);
                return res.status(201).send(updatedItem);
            }
            catch (err) {
                logger.error(err);
                return res.status(400).send({ err });
            }
    })

    router.get(
        endpoints.GET_ITEMS_LATEST,
        auth.tokenCheck,
        async function getItemListEndpoint (req, res) {
            logger.info(`GET_ITEMS_LATEST Request received`)
            try {
                const findResult = await ItemModel.find({}).sort({updatedAt:-1}).limit(10);
                logger.info(`found: ${findResult.length} items`, req);
                return res.status(200).send(findResult);
            }
            catch (err) {
                return res.status(500).send(err);
            }
    })

    return router
}

import express from 'express'
import logger from "../lib/logger";
import { Item } from '../models/item';
import bodyParser from 'body-parser'
import { IItemModel } from '../interfaces/ItemModel';
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

export default (function () {
  return function (router: express.Router) {
    router.get(endpoints.ENDPOINT_ROOT, function (req, res) {
        logger.info(`ENDPOINT_ROOT Request received`)
        res.status(200).send(endpoints)
    })

    router.get(endpoints.ENDPOINT_GET_ITEM_LIST, function (req, res) {
        logger.info(`ENDPOINT_GET_ITEM_LIST Request received`)
        Item.find({})
            .then((findResult) => {
                logger.info(`found: ${findResult.length} items`)
                res.status(200).send(findResult)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    })

    router.get(endpoints.ENDPOINT_GET_ITEM, function (req, res) {
        logger.info(`ENDPOINT_GET_ITEM Request received`)
        logger.info(`req.params: ${JSON.stringify(req.params)}`)
        Item.findById(req.params.itemId)
            .then((findResult) => {
                logger.info(`findResult: ${JSON.stringify(findResult, null, 2)}`)
                res.status(200).send(findResult)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    })

    router.post(endpoints.ENDPOINT_POST_ITEM,
        bodyParser.json(),
        function (req, res) {
            logger.info(`ENDPOINT_POST_ITEM Request received`)
            logger.info(`req.body: ${JSON.stringify(req.body)}`)
            const newPost = new Item(req.body)
            newPost.slug = slugify(req.body.title)
            return newPost.save()
                .then((result: any) => {
                    logger.info(`Item create result: ${JSON.stringify(result, null, 2)}`)
                    res.status(201).send({result})
                })
                .catch((err: any) => {
                    logger.error(err)
                    res.status(400).send({err})
                })
    })

    // router.post(endpoints.ENDPOINT_PUT_ITEM,
    //     bodyParser.json(),
    //     function (req, res) {
    //         logger.info(`ENDPOINT_POST_ITEM Request received`)
    //         logger.info(`req.body: ${JSON.stringify(req.body)}`)
    //         const post: IItemModel = req.body
    //         ItemModel.create(post, (err: any, result: any) => {
    //             logger.info(`Item create result: ${JSON.stringify(result, null, 2)}`)
    //             if (err) logger.error(err)
    //             res.status(201).send({err,result})
    //         })
    // })

    return router

  }
})()

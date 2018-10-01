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

export default (function () {
  return function (router: express.Router) {
    router.get(endpoints.GET_ROOT, function (req, res) {
        logger.info(`GET_ROOT Request received`)
        res.status(200).send(endpoints)
    })

    router.get(endpoints.GET_ITEM_LIST, function (req, res) {
        logger.info(`GET_ITEM_LIST Request received`)
        Item.find({})
            .then((findResult) => {
                logger.info(`found: ${findResult.length} items`)
                res.status(200).send(findResult)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    })

    router.get(endpoints.GET_ITEM_BY_SLUG, function (req, res) {
        logger.info(`GET_ITEM_BY_SLUG Request received`)
        logger.info(`req.params: ${JSON.stringify(req.params)}`)
        Item.findById(req.params.slug)
            .then((findResult) => {
                logger.info(`findResult: ${JSON.stringify(findResult, null, 2)}`)
                res.status(200).send(findResult)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    })

    router.post(endpoints.POST_ITEM,
        bodyParser.json(),
        function (req, res) {
            logger.info(`POST_ITEM Request received`)
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

    // router.post(endpoints.PUT_ITEM,
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

    router.post(endpoints.POST_CONTENT,
        bodyParser.json(),
        function (req, res) {
            logger.info(`POST_CONTENT Request received`)
            logger.info(`req.body: ${JSON.stringify(req.body)}`)
            Item.updateContent(req.params.slug, req.body.text)
                .then((updatedItem: IItem) => {
                    console.log('updatedItem:', JSON.stringify(updatedItem, null, 4))
                    res.status(200).send(updatedItem)
                })
                .catch((err: any) => {
                    logger.error(err)
                    res.status(400).send({err})
                })
    })

    return router

  }
})()

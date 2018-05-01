import express from 'express'
import bodyParser from 'body-parser'
import logger from './logger';
import { ItemModel } from '../interfaces/ItemModel';
import { ItemSchema, Item } from '../models/item';

const ENDPOINT_ROOT = '/'
const ENDPOINT_GET_ITEM_LIST = '/items'
const ENDPOINT_GET_ITEM = '/item/:itemId'
const ENDPOINT_POST_ITEM = '/item'

class App {
    public express: express.Application

    constructor () {
        this.express = express()
        this.mountRoutes()
    }

    private mountRoutes (): void {
        const router = express.Router()
        logger.info('defining endpoints')

        router.get(ENDPOINT_ROOT, function (req, res) {
            logger.info(`ENDPOINT_ROOT Request received`)
            res.send('Hello World')
        })

        router.get(ENDPOINT_GET_ITEM, function (req, res) {
            logger.info(`ENDPOINT_ROOT Request received`)
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

        router.post(ENDPOINT_POST_ITEM,
            bodyParser.json(),
            function (req, res) {
                logger.info(`ENDPOINT_POST_ITEM Request received`)
                logger.info(`req.body: ${JSON.stringify(req.body)}`)
                const post: ItemModel = req.body
                Item.create(post, (err: any, result: any) => {
                    logger.info(`Item create result: ${JSON.stringify(result, null, 2)}`)
                    if (err) logger.error(err)
                    res.status(201).send({err,result})
                })
        })

        this.express.use('/', router)        
    }
}

export default new App().express
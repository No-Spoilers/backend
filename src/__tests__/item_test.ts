import request from 'supertest'
import utils from './utils';
import app from '../lib/app'
import endpoints from '../config/routes';
import { IRevision } from '../interfaces/ItemInterface';

describe('Item route |', () => {
    beforeAll(utils.connectMongoose);
    beforeEach(utils.clearDatabase);
    afterAll(utils.disconnectMongoose);

    it('GET /items | returns a list of items', async () => {
        const result = await request(app)
            .get(endpoints.GET_ITEM_LIST)
        
        expect(result.status).toEqual(200)

        const expectedResult = [{
            "creator": [
                "Creator One",
                "The Partner"
            ],
            "children": [],
            "_id": "5bc97ad307840f75e5d77af9",
            "title": "My Title",
            "slug": "my-title",
            "content": [],
            "createdAt": "2018-10-19T06:33:56.004Z",
            "updatedAt": "2018-10-19T06:33:56.004Z",
            "__v": 0
        }]
        expect(result.body).toEqual(expectedResult)
    })

    it('GET /item/:slug | returns specified item by slug', async () => {
        const token = utils.getStandardToken()
        const slug = 'my-title'

        const testRoute = endpoints.GET_ITEM_BY_SLUG.replace(':slug', slug)
        const result = await request(app)
            .get(testRoute)
            .set({authorization: `Bearer ${token}`})
        
        expect(result.status).toEqual(200)

        const expectedResult = {
            "creator": [
                "Creator One",
                "The Partner"
            ],
            "children": [],
            "_id": "5bc97ad307840f75e5d77af9",
            "title": "My Title",
            "slug": "my-title",
            "content": [],
            "createdAt": "2018-10-19T06:33:56.004Z",
            "updatedAt": "2018-10-19T06:33:56.004Z",
            "__v": 0
        }
        expect(result.body).toEqual(expectedResult)
    })

    it('POST /item | creates new item in DB', async () => {
        const fixtureItem = {
          title: 'some title',

    it('POST /item | rejects duplicate items', async () => {
        const fixtureItem = {
          title: 'some title',
          creator: ['author name', 'author2 name'],
          added_by: '5tg7uj38iked8ik3e'
        }

        const testRoute = endpoints.POST_ITEM
        const res = await request(app).post(testRoute).send(fixtureItem)

        expect(res.status).toEqual(201)

        expect(res.body.title).toEqual(fixtureItem.title)
        expect(res.body.slug).toEqual('some-title')
        expect(res.body.content).toEqual([])
        expect(res.body.children).toEqual([])
        expect(res.body.creator).toEqual(fixtureItem.creator)
        expect(res.body).toHaveProperty('createdAt')

        const res2 = await request(app).post(testRoute).send(fixtureItem)

        expect(res2.status).toEqual(400)
        expect(res2.body.err).toEqual('An item with the address some-title already exists.')
    })

    it('POST /item/:slug | adds content to an item', async () => {
        const slug = 'my-title'
        const newContent = {
          text: `Here's a line of content`
        }

        const testRoute = endpoints.POST_CONTENT.replace(':slug', slug)
        let res = await request(app).post(testRoute).send(newContent)

        expect(res.status).toEqual(201)

        expect(res.body.content[0].text).toEqual(newContent.text)
        expect(res.body.content[0]).toHaveProperty('_id')
        expect(res.body.content[0]).toHaveProperty('updatedAt')
        expect(res.body.content[0]).toHaveProperty('createdAt')
        
        const updatedContent = {
            text: `Here's an updated line of content`
        }
  
        res = await request(app).post(testRoute).send(updatedContent)

        expect(res.body.content.length).toEqual(2)
        const firstResult = res.body.content.findIndex((item:IRevision) => item.text === newContent.text)
        const secondResult = res.body.content.findIndex((item:IRevision) => item.text === updatedContent.text)
        expect(res.body.content[firstResult].text).toEqual(newContent.text)
        expect(res.body.content[firstResult]).toHaveProperty('_id')
        expect(res.body.content[firstResult]).toHaveProperty('updatedAt')
        expect(res.body.content[firstResult]).toHaveProperty('createdAt')
        expect(res.body.content[secondResult].text).toEqual(updatedContent.text)
        expect(res.body.content[secondResult]).toHaveProperty('_id')
        expect(res.body.content[secondResult]).toHaveProperty('updatedAt')
        expect(res.body.content[secondResult]).toHaveProperty('createdAt')
    })
})

import request from 'supertest'
import utils from './utils';
import app from '../lib/app'
import endpoints from '../config/routes';
import { IUser } from '../interfaces/UserModel'

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
          slug: 'some-title',
          creator: ['author name', 'author2 name'],
        }

        const testRoute = endpoints.POST_ITEM
        const res = await request(app).post(testRoute).send(fixtureItem)

        expect(res.status).toEqual(201)

        expect(res.body.title).toEqual(fixtureItem.title)
        expect(res.body.slug).toEqual(fixtureItem.slug)
        expect(res.body.content).toEqual([])
        expect(res.body.children).toEqual([])
        expect(res.body.creator.length).toEqual(2)
        expect(res.body).toHaveProperty('createdAt')
    })
})

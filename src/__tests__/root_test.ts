import app from '../lib/app'
import request from 'supertest'

describe('Root route |', () => {
    it('GET / | returns a list of endpoints', async () => {
        const result = await request(app).get('/')

        expect(result.status).toEqual(200)
        expect(result.body).toEqual({
            "GET_ROOT": "/",
            "POST_LOGIN": "/login",
            "POST_SIGNUP": "/signup",
            "GET_ITEM_LIST": "/items",
            "GET_ITEM_BY_SLUG": "/item/:slug",
            "POST_ITEM": "/item",
            "PUT_ITEM": "/item/:slug",
            "POST_CONTENT": "/item/:slug",
            "GET_USER_LIST": "/users",
            "GET_USER_BY_ID": "/user/:userId",
            "POST_USER": "/user"
        })
    })
})

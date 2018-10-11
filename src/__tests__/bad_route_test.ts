import app from '../lib/app'
import request from 'supertest'

describe('Bad route |', () => {
    it('GET /foo | returns an error', async () => {
        const res = await request(app).get('/foo')

        expect(res.status).toEqual(404)
        expect(res.body).toEqual({
            "status": "404",
            "message": "Route not found",
            "method": "GET",
            "url": "/foo"
        })
    })
})

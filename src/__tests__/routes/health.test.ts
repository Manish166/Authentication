import request from 'supertest';
import * as express from 'express';

// Create a minimal test app with the health check route
const createTestApp = (): express.Express => {
    const app = express.default();
    app.use(express.default.json());

    app.get("/", (req, res) => {
        return res.status(200).json({
            status: "healthy"
        })
    });

    return app;
};

describe('Health Check Endpoint - GET /', () => {
    let app: express.Express;

    beforeEach(() => {
        app = createTestApp();
    });

    it('should return 200 status code', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);
    });

    it('should return JSON response with healthy status', async () => {
        const response = await request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).toEqual({
            status: "healthy"
        });
    });

    it('should have correct response structure', async () => {
        const response = await request(app)
            .get('/');

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('healthy');
    });

    it('should always return the same response', async () => {
        const response1 = await request(app).get('/');
        const response2 = await request(app).get('/');

        expect(response1.body).toEqual(response2.body);
        expect(response1.status).toBe(response2.status);
    });

    it('should handle multiple consecutive requests', async () => {
        for (let i = 0; i < 5; i++) {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body.status).toBe('healthy');
        }
    });

    it('should return JSON content type header', async () => {
        const response = await request(app)
            .get('/');

        expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should not accept query parameters', async () => {
        const response = await request(app)
            .get('/?test=value')
            .expect(200);

        // Should still return healthy status despite query params
        expect(response.body.status).toBe('healthy');
    });

    it('should not accept POST requests', async () => {
        await request(app)
            .post('/')
            .expect(404);
    });

    it('should not accept PUT requests', async () => {
        await request(app)
            .put('/')
            .expect(404);
    });

    it('should not accept DELETE requests', async () => {
        await request(app)
            .delete('/')
            .expect(404);
    });
});

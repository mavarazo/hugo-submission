import request from 'supertest';
import app from '../app';

describe('Token Controller', () => {
  it('get token', async () => {
    // act
    const res = await request(app).get('/api/token').expect(200);

    // assert
    expect(res.body.token).toBeDefined();
  });
});

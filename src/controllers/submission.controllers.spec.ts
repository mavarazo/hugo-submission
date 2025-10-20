import request from 'supertest';
import app from '../app';
import { generateHMACToken } from '../utils/token.functions';
import { config } from '../configs/config';

describe('Submission Controller', () => {
  it('should not save submission when honeypot is received', async () => {
    // act && assert
    const res = await request(app)
      .post('/api/submission')
      .send({
        website: 'https://bingo.foo',
      })
      .expect(204);
  });

  it('should not save submission when token is missing', async () => {
    // act && assert
    await request(app).post('/api/submission').send({}).expect(400);
  });

  it('should not save submission when token is invalid', async () => {
    // act && assert
    await request(app).post('/api/submission').send({ token: '' }).expect(400);
  });

  [
    { name: null, email: 'bingo@foo.com', message: 'Bingo' },
    { name: 'Bingo', email: null, message: 'Bingo' },
    { name: 'Bingo', email: 'bingo@foo.com', message: null },
  ].forEach((reqBody) =>
    it('should not save submission when name, email or message is missing', async () => {
      // arrange
      const token = generateHMACToken(
        Math.floor(Date.now() / 1000),
        config.tokenSecret,
      );

      // act && assert
      await request(app)
        .post('/api/submission')
        .send({ ...reqBody, token: token })
        .expect(400);
    }),
  );

  it('should save submission "general"', async () => {
    // arrange
    const token = generateHMACToken(
      Math.floor(Date.now() / 1000) - 5,
      config.tokenSecret,
    );

    // act && assert
    await request(app)
      .post('/api/submission')
      .send({
        token: token,
        name: 'Bingo',
        email: 'bingo@foo.com',
        message: 'Bingo',
      })
      .expect(200);
  });

  it('should save submission "product"', async () => {
    // arrange
    const token = generateHMACToken(
      Math.floor(Date.now() / 1000) - 5,
      config.tokenSecret,
    );

    // act && assert
    await request(app)
      .post('/api/submission')
      .send({
        token: token,
        name: 'Bingo',
        email: 'bingo@foo.com',
        message: 'Bingo',
        product_name: 'Bingo',
        product_url: 'https://bingo.foo',
      })
      .expect(200);
  });
});

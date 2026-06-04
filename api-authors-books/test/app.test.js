const request = require('supertest');
const app = require('../index');

describe('API Authors', () => {

  test('GET /authors debe responder 200', async () => {

    const res = await request(app).get('/authors');

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('data');

  });

  test('POST /authors debe crear un author', async () => {

    const newAuthor = {
      name: 'Test Jest',
      age: 30
    };

    const res = await request(app)
      .post('/authors')
      .send(newAuthor);

    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty('id');

    expect(res.body.name).toBe(newAuthor.name);

  });

  test('POST /authors debe devolver 400 si faltan datos', async () => {

    const res = await request(app)
      .post('/authors')
      .send({
        name: ''
      });

    expect(res.status).toBe(400);

    expect(res.body.message).toBe('Bad request');

  });

});
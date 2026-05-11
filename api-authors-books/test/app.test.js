const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

describe('API Authors', () => {

  // GET AUTHORS
  it('GET /authors debe responder 200', async () => {
    const res = await request(app).get('/authors');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('data');
  });

  // POST AUTHOR OK
  it('POST /authors debe crear un author', async () => {
    const newAuthor = {
      name: 'Gabriel Garcia Marquez',
      age: 80
    };

    const res = await request(app)
      .post('/authors')
      .send(newAuthor);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(newAuthor.name);
  });

  // POST AUTHOR ERROR
  it('POST /authors debe devolver 400 si faltan datos', async () => {

    const res = await request(app)
      .post('/authors')
      .send({
        name: ''
      });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Bad request');
  });

});

//DELETE

describe('DELETE AUTHORS', () => {

  it('DELETE /authors/:id debe eliminar un author', async () => {

    // Crear author primero
    const author = await request(app)
      .post('/authors')
      .send({
        name: 'Autor Test',
        age: 40
      });

    const id = author.body.id;

    // Eliminar
    const res = await request(app)
      .delete(`/authors/${id}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Author deleted');
  });

});


describe('UPDATE AUTHORS', () => {

  it('PUT /authors/:id debe actualizar author', async () => {

    // Crear author
    const author = await request(app)
      .post('/authors')
      .send({
        name: 'Viejo',
        age: 30
      });

    const id = author.body.id;

    // Actualizar
    const res = await request(app)
      .put(`/authors/${id}`)
      .send({
        name: 'Nuevo',
        age: 35
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Author updated');
  });

});
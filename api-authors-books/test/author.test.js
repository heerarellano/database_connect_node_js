const request = require('supertest');
const cheerio = require('cheerio');
const app = require('../index'); // tu index.js

describe('Authors HTML Test', () => {

  test('Debe cargar el home correctamente', async () => {

    const response = await request(app).get('/');

    expect(response.status).toBe(200);

    const $ = cheerio.load(response.text);

    // Verificar título
    expect($('h2').text()).toContain('Data Tables');
 
    // Verificar botones (Cuántos hay)
    expect($('#btnAuthors').length).toBe(1);
    expect($('#btnBooks').length).toBe(1);

    // Verificar tabla (Cuántos hay)
    expect($('#mainTable').length).toBe(1);

  });

});


describe('Author Form', () => {

  test('Debe mostrar formulario author', async () => {

    const response = await request(app).get('/authors/new');

    expect(response.status).toBe(200);

    const $ = cheerio.load(response.text);

    // verificar form (Cuántos hay)
    expect($('form').length).toBe(1);

    // verificar input name (Cuántos hay)
    expect($('input[name="name"]').length).toBe(1);

    // verificar input age (Cuántos hay)
    expect($('input[name="age"]').length).toBe(1);

  });

});

describe('Author Modal', () => {

  test('Debe existir modal author', async () => {

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);

    expect($('#authorModal').length).toBe(1);

    expect($('#btnSaveAuthor').length).toBe(1);

    expect($('#authorName').length).toBe(1);

    expect($('#authorAge').length).toBe(1);

  });

});  
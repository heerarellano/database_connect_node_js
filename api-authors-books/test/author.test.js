const request = require('supertest');
const cheerio = require('cheerio');
const app = require('../index');

describe('TESTS HTML Y FORMULARIOS', () => {

  // Caso 1: Validar texto exacto del título principal
  test('1. Validar texto exacto del título', async () => {

    const response = await request(app).get('/');

    expect(response.status).toBe(200);

    const $ = cheerio.load(response.text);

    expect($('h2').text().trim()).toBe('Data Tables');

  }); 

  // Caso 2: Validar existencia, cantidad y texto del botón Authors
  test('2. Validar botón Authors', async () => {

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);

    expect($('#btnAuthors').length).toBe(1); // Igual a 1.

    expect($('#btnAuthors').text()).toContain('Authors'); //Contiene el texto autor. 

    expect($('#btnAuthors').attr('id')).toBe('btnAuthors'); //El id es. 

  });

  // Caso 3: Validar existencia y contenido del botón Books
  test('3. Validar botón Books', async () => {

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);

    expect($('#btnBooks').length).toBe(1);

    expect($('#btnBooks').text()).toContain('Books');

  });

  // Caso 4: Validar que exista una tabla HTML principal
  test('4. Validar tabla principal', async () => {

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);

    expect($('#mainTable').length).toBe(1);

    expect($('#mainTable').is('table')).toBe(true); //Evaluación de tag. 
  
  });

  // Caso 5: Validar existencia del formulario de authors
  test('5. Validar formulario author', async () => {

    const response = await request(app).get('/authors/new');

    const $ = cheerio.load(response.text);

    expect($('form').length).toBe(1); 

    expect($('form').attr('method')).toBeDefined();

  });

  // Caso 6: Validar atributos del input name
  test('6. Validar input name', async () => {

    const response = await request(app).get('/authors/new');

    const $ = cheerio.load(response.text);

    const inputName = $('input[name="name"]');

    expect(inputName.length).toBe(1);

    expect(inputName.attr('type')).toBe('text'); // Tipo de atributo. 

    expect(inputName.attr('name')).toBe('name'); //Nombre de atributo. 

  });

  // Caso 7: Validar tipo y existencia del input age
  test('7. Validar input age', async () => {

    const response = await request(app).get('/authors/new');

    const $ = cheerio.load(response.text);

    const inputAge = $('input[name="age"]');

    expect(inputAge.length).toBe(1);

    expect(inputAge.attr('type')).toBe('number');

  });

  // Caso 8: Validar existencia y clase CSS del modal
  test('8. Validar modal author', async () => {

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);

    expect($('#authorModal').length).toBe(1);

    expect($('#authorModal').hasClass('modal')).toBe(true);

  });

  // Caso 9: Validar texto, tipo y existencia del botón guardar
  test('9. Validar botón guardar author', async () => {

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);

    const btn = $('#btnSaveAuthor');

    expect(btn.length).toBe(1);

    expect(btn.text()).toContain('Save');

    expect(btn.is('button')).toBe(true);

  });

  // Caso 10: Validar IDs y valor inicial de inputs del modal
  test('10. Validar inputs del modal', async () => {

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);

    expect($('#authorName').attr('id')).toBe('authorName');

    expect($('#authorAge').attr('id')).toBe('authorAge');

    //expect($('#authorName').val()).toBe('');
    expect($('#authorName').val() || '').toBe(''); 

  }); 

});
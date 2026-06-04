const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { sequelize } = require('./connection');
const { Author, Book } = require('./models'); 

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist')); 
app.use(express.urlencoded({ extended: true }));

// Home muestra los data tables.
app.get('/', (req, res) => {
  res.render('index');
});

//  SOLO JSON para DataTables
/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Obtener todos los autores
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Lista de autores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       age:
 *                         type: integer
 */
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.findAll();
    return res.json({ data: authors }); 
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Mostrar formulario author con para trabajar con render.
app.get('/authors/new', (req, res) => {
  res.render('authors/form');
});

// Mostrar formulario author con para trabajar AJAX
app.get('/authors/newAuthAjax', (req, res) => {
  res.render('authors/form_ajax_auth');
});


//POST authors (Create)
/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Crear autor
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Autor creado
 *       400:
 *         description: Bad request
 */
app.post('/authors', async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: 'Bad request' });
    }

    const save = await Author.create({ name, age });
    //return res.redirect('/'); 
    res.status(201).json(save);
    
  } catch (error) { 
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//Update - put

app.put('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    const updated = await Author.update(
      { name, age },
      { where: { id } }
    ); 

    return res.json({ message: 'Author updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating author' });
  }
});


//Books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    return res.json({ data: books }); //
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/books', async (req, res) => {
  try {
    const { isbn, name, cantPages, author } = req.body;

    if (!isbn || !name || !cantPages || !author) {
      return res.status(400).json({ message: 'Bad request' });
    }

    const save = await Book.create({
      isbn,
      name,
      cantPages,
      authorId: author
    });

    return res.status(201).json(save);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE AUTHOR
/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Eliminar autor
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Author deleted
 *       404:
 *         description: Author not found
 */
app.delete('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Author.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.json({ message: 'Author deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE BOOK
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Book.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({ message: 'Book deleted' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH AUTHOR
/**
 * @openapi
 * /authors/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un autor
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Author patched
 */
app.patch('/authors/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const dataToUpdate = {};

    if (req.body.name !== undefined) {
      dataToUpdate.name = req.body.name;
    }

    if (req.body.age !== undefined) {
      dataToUpdate.age = req.body.age;
    }

    await Author.update(
      dataToUpdate,
      { where: { id } }
    );

    return res.json({
      message: 'Author patched'
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: 'Internal server error'
    });

  }

});



if (require.main === module) {
  startServer();
}


module.exports = app;
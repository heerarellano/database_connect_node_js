const express = require('express');
const { sequelize } = require('./connection');
const { Author, Book } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

// Home - shows data tables
app.get('/', (req, res) => {
  res.render('index');
});

// GET all authors (JSON for DataTables)
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.findAll();
    return res.json({ data: authors });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET author form (render)
app.get('/authors/new', (req, res) => {
  res.render('authors/form');
});

// GET author form (AJAX)
app.get('/authors/newAuthAjax', (req, res) => {
  res.render('authors/form_ajax_auth');
});

// POST author (Create)
app.post('/authors', async (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || !age) {
      return res.status(400).json({ message: 'Bad request' });
    }
    const save = await Author.create({ name, age });
    return res.render('index');
    //res.status(201).json(save);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT author (Update)
app.put('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;
    await Author.update(
      { name, age },
      { where: { id } }
    );
    return res.json({ message: 'Author updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating author' });
  }
});

// PATCH author (Partial update)
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
    await Author.update(dataToUpdate, { where: { id } });
    return res.json({ message: 'Author patched' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE author
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

// GET all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    return res.json({ data: books });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST book (Create)
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

// DELETE book
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

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection success');
    await sequelize.sync();
    console.log('Sync models');
    
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Connection failed', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;

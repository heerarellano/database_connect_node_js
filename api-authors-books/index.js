const express = require('express');
const app = express();
const port = 3000;
const { sequelize } = require('./connection');
const { Author, Book } = require('./models'); 

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

// Home ahora renderiza la tabla
app.get('/', (req, res) => {
  res.render('index');
});

//  SOLO JSON para DataTables
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.findAll();
    return res.json({ data: authors }); 
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/authors', async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: 'Bad request' });
    }

    const save = await Author.create({ name, age });
    return res.status(201).json(save);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

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

sequelize.authenticate()
  .then(() => {
    console.log('Connection success');
    return sequelize.sync();
  }) 
  .then(() => {
    console.log('Sync models');
    app.listen(port, () => {
      console.log(`Server listen on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Connection fail', error);
  }); 
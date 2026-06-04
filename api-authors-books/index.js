const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { sequelize } = require('./connection');
const { Author, Book } = require('./models'); 

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
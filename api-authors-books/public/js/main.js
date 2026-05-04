let table;
let currentType = ''; // 'author' o 'book'

$(document).ready(function () {
  loadAuthors();

  $('#btnAuthors').click(loadAuthors);
  $('#btnBooks').click(loadBooks);
});

function resetTable(headers) {
  if (table) {
    table.destroy();
  }

  $('#mainTable').empty();

  $('#mainTable').append(`
    <thead>
      <tr>${headers}</tr>
    </thead>
  `);
}

// VIEW (abrir modal)
$('#mainTable').on('click', '.btn-view', function () {
  const data = table.row($(this).parents('tr')).data();

  $('#viewId').val(data.id);
  $('#viewName').val(data.name);

  if (data.age !== undefined) {
    currentType = 'author';
    $('#viewExtra').val(data.age);
  } else {
    currentType = 'book';
    $('#viewExtra').val(data.cantPages);
  }

  const modal = new bootstrap.Modal(document.getElementById('viewModal'));
  modal.show();
});

// UPDATE
$(document).on('click', '#btnUpdate', function () {
  const id = $('#viewId').val();
  const name = $('#viewName').val();
  const extra = $('#viewExtra').val();

  if (!currentType) {
    alert('No type detected');
    return;
  }

  let url = '';
  let data = {};

  if (currentType === 'author') {
    url = `/authors/${id}`;
    data = { name, age: Number(extra) };
  } else {
    url = `/books/${id}`;
    data = { name, cantPages: Number(extra) };
  }

  $.ajax({
    url: url,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (res) {
      console.log('UPDATED:', res);

      const modalEl = document.getElementById('viewModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      table.ajax.reload();
    },
    error: function (err) {
      console.log(err);
      alert('Error updating');
    }
  });
});

// LOAD AUTHORS
function loadAuthors() {
  resetTable(`
    <th>ID</th>
    <th>Name</th>
    <th>Age</th>
    <th>Actions</th>
  `);

  table = $('#mainTable').DataTable({
    ajax: {
      url: '/authors',
      dataSrc: 'data'
    },
    columns: [
      { data: 'id' },
      { data: 'name' },
      { data: 'age' },
      {
        data: null,
        render: function (data) {
          return `
            <button class="btn btn-info btn-view">View</button>
            <button class="btn btn-danger btn-delete-author" data-id="${data.id}">Delete</button>
          `;
        }
      }
    ]
  });
}

// LOAD BOOKS
function loadBooks() {
  resetTable(`
    <th>ID</th>
    <th>ISBN</th>
    <th>Name</th>
    <th>Pages</th>
    <th>Actions</th>
  `);

  table = $('#mainTable').DataTable({
    ajax: {
      url: '/books',
      dataSrc: 'data'
    },
    columns: [
      { data: 'id' },
      { data: 'isbn' },
      { data: 'name' },
      { data: 'cantPages' },
      {
        data: null,
        render: function (data) {
          return `
            <button class="btn btn-info btn-view">View</button>
            <button class="btn btn-danger btn-delete-book" data-id="${data.id}">Delete</button>
          `;
        }
      }
    ]
  });
}

// DELETE AUTHOR
$('#mainTable').on('click', '.btn-delete-author', function () {
  const id = $(this).data('id');

  if (!confirm('Delete this author?')) return;

  $.ajax({
    url: `/authors/${id}`,
    type: 'DELETE',
    success: function () {
      table.ajax.reload();
    },
    error: function () {
      alert('Error deleting author');
    }
  });
});

// DELETE BOOK
$('#mainTable').on('click', '.btn-delete-book', function () {
  const id = $(this).data('id');

  if (!confirm('Delete this book?')) return;

  $.ajax({
    url: `/books/${id}`,
    type: 'DELETE',
    success: function () {
      table.ajax.reload();
    },
    error: function () {
      alert('Error deleting book');
    }
  });
});

// CREATE AUTHOR (desde form.ejs)
$(document).on('submit', '#authorForm', function (e) {
  e.preventDefault();

  const data = {
    name: $('input[name="name"]').val(),
    age: $('input[name="age"]').val()
  };

  $.ajax({
    url: '/authors',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function () {
      window.location.href = '/'; //Envía a home. 
    },
    error: function () {
      alert('Error saving author'); 
    }
  });
});

$(document).on('click', '#btnNewAuthor', function () {
  window.location.href = '/authors/newAuthAjax'; // Envío a index.js
});
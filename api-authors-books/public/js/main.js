let table;

$(document).ready(function () {
  loadAuthors();

  $('#btnAuthors').click(loadAuthors);
  $('#btnBooks').click(loadBooks);
});

function resetTable(headers) {
  if (table) {
    table.destroy();
  }

  // 🔥 limpia completamente la tabla
  $('#mainTable').empty();

  // 🔥 reconstruye el thead
  $('#mainTable').append(`
    <thead>
      <tr>${headers}</tr>
    </thead>
  `);
}

function loadAuthors() {
  resetTable(`
    <th>ID</th>
    <th>Name</th>
    <th>Age</th>
    <th>Actions</th>
  `);

  table = $('#mainTable').DataTable({
    ajax: '/authors',
    columns: [
      { data: 'id' },
      { data: 'name' },
      { data: 'age' },
      {
        data: null,
        render: function (data) {
          return `<button class="btn btn-danger btn-delete-author" data-id="${data.id}">Delete</button>`;
        }
      }
    ]
  });
}

function loadBooks() {
  resetTable(`
    <th>ID</th>
    <th>ISBN</th>
    <th>Name</th>
    <th>Pages</th>
    <th>Actions</th>
  `);

  table = $('#mainTable').DataTable({
    ajax: '/books',
    columns: [
      { data: 'id' },
      { data: 'isbn' },
      { data: 'name' },
      { data: 'cantPages' },
      {
        data: null,
        render: function (data) {
          return `<button class="btn btn-danger btn-delete-book" data-id="${data.id}">Delete</button>`;
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
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

  $('#mainTable').empty();

  $('#mainTable').append(`
    <thead>
      <tr>${headers}</tr>
    </thead>
  `);
}

$('#mainTable').on('click', '.btn-view', function () {
  const data = table.row($(this).parents('tr')).data();

  console.log(data); // verifica en consola

  $('#viewId').val(data.id);
  $('#viewName').val(data.name);

  // Detecta si es author o book
  if (data.age !== undefined) {
    $('#viewExtra').val('Age: ' + data.age);
  } else {
    $('#viewExtra').val('Pages: ' + data.cantPages);
  }

  const modal = new bootstrap.Modal(document.getElementById('viewModal'));
  modal.show();
});

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



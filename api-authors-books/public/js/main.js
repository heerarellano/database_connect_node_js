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
  `);

  table = $('#mainTable').DataTable({
    ajax: '/authors',
    columns: [
      { data: 'id' },
      { data: 'name' },
      { data: 'age' }
    ]
  });
}

function loadBooks() {
  resetTable(`
    <th>ID</th>
    <th>ISBN</th>
    <th>Name</th>
    <th>Pages</th>
  `);

  table = $('#mainTable').DataTable({
    ajax: '/books',
    columns: [
      { data: 'id' },
      { data: 'isbn' },
      { data: 'name' },
      { data: 'cantPages' }
    ]
  });
}
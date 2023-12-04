// Cargar la API de Google Books
google.books.load();

function searchBooks() {
  const searchInput = document.getElementById('searchInput').value;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchInput)}`;

  axios.get(url)
    .then(response => {
      displayResults(response.data.items);
    })
    .catch(error => {
      console.error('Error fetching data from Google Books API', error);
    });
}

function displayResults(books) {
  const bookContainer = document.getElementById('bookContainer');
  bookContainer.innerHTML = '';

  if (books.length === 0) {
    bookContainer.innerHTML = '<p>No results found</p>';
    return;
  }

  books.forEach(book => {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4');

    // Limitar la longitud de la descripción a 100 caracteres
    const truncatedDescription = book.volumeInfo.description ? `${book.volumeInfo.description.slice(0, 100)}...` : 'No description available';

    card.innerHTML = `
      <div class="card">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${book.volumeInfo.imageLinks?.thumbnail}" class="img-fluid rounded-start" alt="Book Cover">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${book.volumeInfo.title}</h5>
              <p class="card-text">By: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
              <p class="card-text">${truncatedDescription}</p>
              <!-- Agregar el visor embebido -->
              <div id="viewerCanvas"></div>
              <button onclick="loadEmbeddedViewer('${book.id}')">Open Viewer</button>
            </div>
          </div>
        </div>
      </div>
    `;

    bookContainer.appendChild(card);
  });
}

function loadEmbeddedViewer(bookId) {
  const viewerContainer = document.getElementById('viewerCanvas');

  // Cargar el visor embebido
  google.books.load();
  google.books.setOnLoadCallback(function () {
    const viewer = new google.books.DefaultViewer(viewerContainer);
    viewer.load(bookId);
  });
}

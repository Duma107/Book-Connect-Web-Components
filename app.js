// app.js
import { BookPreview, BookList, SearchOverlay } from './book-components.js';
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

class BookConnectApp {
  constructor() {
    this.books = books;
    this.authors = authors;
    this.genres = genres;
    this.BOOKS_PER_PAGE = BOOKS_PER_PAGE;
    this.matches = books;
    
    this.initialize();
  }

  initialize() {
    // Initialize book list
    this.bookList = document.querySelector('book-list');
    this.bookList.setAttribute('books-per-page', this.BOOKS_PER_PAGE);
    this.bookList.bookData = this.matches;

    // Initialize search overlay
    this.setupSearch();
    
    // Initialize theme
    this.setupTheme();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  setupSearch() {
    const searchOverlay = document.querySelector('search-overlay');
    
    // Populate genre options
    const genresFrag = document.createDocumentFragment();
    const genreOption = document.createElement('option');
    genreOption.value = 'any';
    genreOption.textContent = 'All Genres';
    genreOption.slot = 'genres';
    genresFrag.appendChild(genreOption);

    for (const [id, name] of Object.entries(this.genres)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      option.slot = 'genres';
      genresFrag.appendChild(option);
    }
    searchOverlay.appendChild(genresFrag);

    // Populate author options
    const authorsFrag = document.createDocumentFragment();
    const authorOption = document.createElement('option');
    authorOption.value = 'any';
    authorOption.textContent = 'All Authors';
    authorOption.slot = 'authors';
    authorsFrag.appendChild(authorOption);

    for (const [id, name] of Object.entries(this.authors)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      option.slot = 'authors';
      authorsFrag.appendChild(option);
    }
    searchOverlay.appendChild(authorsFrag);
  }

  setupTheme() {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'night' : 'day';
    this.applyTheme(theme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'night') {
      root.style.setProperty('--color-dark', '255, 255, 255');
      root.style.setProperty('--color-light', '10, 10, 20');
    } else {
      root.style.setProperty('--color-dark', '10, 10, 20');
      root.style.setProperty('--color-light', '255, 255, 255');
    }
  }

  setupEventListeners() {
    // Search button handler
    document.querySelector('[data-header-search]').addEventListener('click', () => {
      document.querySelector('search-overlay').setAttribute('open', '');
    });

    // Search event handler
    document.addEventListener('search', (event) => {
      const { title, author, genre } = event.detail;
      
      const results = this.books.filter(book => {
        const titleMatch = title.trim() === '' || 
                          book.title.toLowerCase().includes(title.toLowerCase());
        const authorMatch = author === 'any' || book.author === author;
        const genreMatch = genre === 'any' || book.genres.includes(genre);

        return titleMatch && authorMatch && genreMatch;
      });

      this.matches = results;
      this.bookList.bookData = results;
      this.bookList.showMessage(results.length < 1);
      window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Book preview click handler
    document.addEventListener('preview-click', (event) => {
      const bookId = event.detail.bookId;
      const book = this.books.find(b => b.id === bookId);
      
      if (book) {
        const dialog = document.querySelector('[data-list-active]');
        dialog.querySelector('[data-list-blur]').src = book.image;
        dialog.querySelector('[data-list-image]').src = book.image;
        dialog.querySelector('[data-list-title]').innerText = book.title;
        dialog.querySelector('[data-list-subtitle]').innerText = 
          `${this.authors[book.author]} (${new Date(book.published).getFullYear()})`;
        dialog.querySelector('[data-list-description]').innerText = book.description;
        dialog.open = true;
      }
    });

    // Theme settings handler
    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      
      this.applyTheme(theme);
      document.querySelector('[data-settings-overlay]').open = false;
    });
  }
}

// Initialize the application
const app = new BookConnectApp();
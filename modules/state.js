// modules/state.js
/**
 * Manages the application's state including books, authors, and pagination
 */
class AppState {
    constructor(books, authors, genres, booksPerPage) {
      this.books = books;           // Array of all books
      this.authors = authors;       // Object mapping author IDs to names
      this.genres = genres;         // Object mapping genre IDs to names
      this.BOOKS_PER_PAGE = booksPerPage;  // Number of books to display per page
      this.page = 1;               // Current page number
      this.matches = books;        // Books that match current search criteria
    }
}

// modules/dom.js
/**
 * Handles DOM-related operations and element creation
 */
class DOMHandler {
    // DOM selector strings for frequently accessed elements
    static selectors = {
      listItems: '[data-list-items]',
      searchGenres: '[data-search-genres]',
      searchAuthors: '[data-search-authors]',
      settingsTheme: '[data-settings-theme]',
      listButton: '[data-list-button]',
      searchOverlay: '[data-search-overlay]',
      settingsOverlay: '[data-settings-overlay]',
      listActive: '[data-list-active]',
      searchTitle: '[data-search-title]',
      listMessage: '[data-list-message]'
    };

    /**
     * Creates a book preview button element
     * @param {Object} book - Book object containing id, image, title
     * @param {Object} authors - Authors mapping object
     * @returns {HTMLElement} Button element containing book preview
     */
    static createBookPreview(book, authors) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', book.id);

      element.innerHTML = `
        <img class="preview__image" src="${book.image}" />
        <div class="preview__info">
          <h3 class="preview__title">${book.title}</h3>
          <div class="preview__author">${authors[book.author]}</div>
        </div>
      `;

      return element;
    }

    /**
     * Creates an option element for dropdowns
     * @param {string} value - Option value
     * @param {string} text - Option display text
     * @returns {HTMLElement} Option element
     */
    static createOptionElement(value, text) {
      const element = document.createElement('option');
      element.value = value;
      element.innerText = text;
      return element;
    }
}

// modules/bookList.js
/**
 * Manages the display and updates of the book list
 */
class BookListManager {
    constructor(state, domHandler) {
      this.state = state;
      this.domHandler = domHandler;
    }

    /**
     * Creates a document fragment containing book previews for current page
     * @param {Array} books - Array of book objects to render
     * @returns {DocumentFragment} Fragment containing book preview elements
     */
    renderBookList(books) {
      const fragment = document.createDocumentFragment();
      const start = (this.state.page - 1) * this.state.BOOKS_PER_PAGE;
      const end = start + this.state.BOOKS_PER_PAGE;

      for (const book of books.slice(start, end)) {
        const element = this.domHandler.createBookPreview(book, this.state.authors);
        fragment.appendChild(element);
      }

      return fragment;
    }

    /**
     * Updates the book list display with new books
     * @param {Array} books - Array of books to display
     */
    updateBookList(books) {
      const listItems = document.querySelector(this.domHandler.selectors.listItems);
      listItems.innerHTML = '';
      const fragment = this.renderBookList(books);
      listItems.appendChild(fragment);
    }

    /**
     * Updates the "Show more" button state and remaining count
     */
    updateShowMoreButton() {
      const remaining = this.state.matches.length - (this.state.page * this.state.BOOKS_PER_PAGE);
      const button = document.querySelector(this.domHandler.selectors.listButton);
      button.disabled = remaining <= 0;
      button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
      `;
    }
}

// modules/search.js
/**
 * Manages search functionality including filters and results
 */
class SearchManager {
    constructor(state, bookListManager) {
      this.state = state;
      this.bookListManager = bookListManager;
    }

    /**
     * Initializes search form and dropdowns
     */
    setupSearchForm() {
      this.populateDropdowns();
      this.attachSearchListeners();
    }

    /**
     * Populates genre and author dropdown menus
     */
    populateDropdowns() {
      // Create and populate genres dropdown
      const genreHtml = document.createDocumentFragment();
      genreHtml.appendChild(DOMHandler.createOptionElement('any', 'All Genres'));

      for (const [id, name] of Object.entries(this.state.genres)) {
        genreHtml.appendChild(DOMHandler.createOptionElement(id, name));
      }

      // Create and populate authors dropdown
      const authorHtml = document.createDocumentFragment();
      authorHtml.appendChild(DOMHandler.createOptionElement('any', 'All Authors'));

      for (const [id, name] of Object.entries(this.state.authors)) {
        authorHtml.appendChild(DOMHandler.createOptionElement(id, name));
      }

      // Add dropdowns to DOM
      document.querySelector(DOMHandler.selectors.searchGenres).appendChild(genreHtml);
      document.querySelector(DOMHandler.selectors.searchAuthors).appendChild(authorHtml);
    }

    /**
     * Filters books based on search criteria
     * @param {Object} filters - Object containing title, author, and genre filters
     * @returns {Array} Filtered array of books
     */
    handleSearch(filters) {
      const result = this.state.books.filter(book => {
        const titleMatch = filters.title.trim() === '' || 
                          book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);

        return titleMatch && authorMatch && genreMatch;
      });

      this.state.matches = result;
      this.state.page = 1;

      return result;
    }

    /**
     * Sets up search form submission handler
     */
    attachSearchListeners() {
      const searchForm = document.querySelector('[data-search-form]');
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        
        const results = this.handleSearch(filters);
        this.bookListManager.updateBookList(results);
        this.bookListManager.updateShowMoreButton();

        // Show message if no results found
        const listMessage = document.querySelector(DOMHandler.selectors.listMessage);
        listMessage.classList.toggle('list__message_show', results.length < 1);

        // Close search overlay and scroll to top
        document.querySelector(DOMHandler.selectors.searchOverlay).open = false;
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
    }
}

// modules/theme.js
/**
 * Manages theme-related functionality (light/dark mode)
 */
class ThemeManager {
    /**
     * Sets up initial theme based on user's system preferences
     */
    static setupTheme() {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'night' : 'day';
      
      document.querySelector(DOMHandler.selectors.settingsTheme).value = theme;
      ThemeManager.applyTheme(theme);
    }

    /**
     * Applies selected theme by updating CSS variables
     * @param {string} theme - Theme name ('night' or 'day')
     */
    static applyTheme(theme) {
      const root = document.documentElement;
      if (theme === 'night') {
        root.style.setProperty('--color-dark', '255, 255, 255');
        root.style.setProperty('--color-light', '10, 10, 20');
      } else {
        root.style.setProperty('--color-dark', '10, 10, 20');
        root.style.setProperty('--color-light', '255, 255, 255');
      }
    }
}

// app.js
/**
 * Main application class that initializes and coordinates all components
 */
class BookConnectApp {
    constructor(books, authors, genres, BOOKS_PER_PAGE) {
      // Initialize app state and managers
      this.state = new AppState(books, authors, genres, BOOKS_PER_PAGE);
      this.bookListManager = new BookListManager(this.state, DOMHandler);
      this.searchManager = new SearchManager(this.state, this.bookListManager);
      
      this.initialize();
    }

    /**
     * Initializes the application
     */
    initialize() {
      // Render initial book list
      const initialBooks = this.bookListManager.renderBookList(this.state.books);
      document.querySelector(DOMHandler.selectors.listItems).appendChild(initialBooks);

      // Setup components
      this.searchManager.setupSearchForm();
      ThemeManager.setupTheme();
      this.setupEventListeners();
      this.bookListManager.updateShowMoreButton();
    }

    /**
     * Sets up all event listeners for the application
     */
    setupEventListeners() {
      // Dialog control event listeners
      document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector(DOMHandler.selectors.searchOverlay).open = false;
      });

      document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector(DOMHandler.selectors.settingsOverlay).open = false;
      });

      document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector(DOMHandler.selectors.searchOverlay).open = true;
        document.querySelector(DOMHandler.selectors.searchTitle).focus();
      });

      document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector(DOMHandler.selectors.settingsOverlay).open = true;
      });

      document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector(DOMHandler.selectors.listActive).open = false;
      });

      // Settings form submission handler
      document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        
        ThemeManager.applyTheme(theme);
        document.querySelector(DOMHandler.selectors.settingsOverlay).open = false;
      });

      // Show more button handler
      document.querySelector(DOMHandler.selectors.listButton).addEventListener('click', () => {
        this.state.page++;
        const fragment = this.bookListManager.renderBookList(this.state.matches);
        document.querySelector(DOMHandler.selectors.listItems).appendChild(fragment);
        this.bookListManager.updateShowMoreButton();
      });

      // Book preview click handler
      document.querySelector(DOMHandler.selectors.listItems).addEventListener('click', (event) => {
        const pathArray = Array.from(event.path || event.composedPath());
        const activeBook = pathArray.find(node => node?.dataset?.preview)?.dataset?.preview;
        
        if (activeBook) {
          const book = this.state.books.find(book => book.id === activeBook);
          if (book) {
            // Update and show book details dialog
            const dialog = document.querySelector(DOMHandler.selectors.listActive);
            dialog.open = true;
            
            dialog.querySelector('[data-list-blur]').src = book.image;
            dialog.querySelector('[data-list-image]').src = book.image;
            dialog.querySelector('[data-list-title]').innerText = book.title;
            dialog.querySelector('[data-list-subtitle]').innerText = 
              `${this.state.authors[book.author]} (${new Date(book.published).getFullYear()})`;
            dialog.querySelector('[data-list-description]').innerText = book.description;
          }
        }
      });
    }
}

// Initialize app with data
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
const app = new BookConnectApp(books, authors, genres, BOOKS_PER_PAGE);
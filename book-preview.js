// book-preview.js

/**
 * Web Component for displaying a book preview
 */
class BookPreview extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['book-id', 'image', 'title', 'author'];
    }
  
    connectedCallback() {
      this.render();
      this.addEventListeners();
    }
  
    attributeChangedCallback() {
      if (this.shadowRoot) {
        this.render();
      }
    }
  
    render() {
      const bookId = this.getAttribute('book-id');
      const image = this.getAttribute('image');
      const title = this.getAttribute('title');
      const author = this.getAttribute('author');
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          
          .preview {
            border-width: 0;
            width: 100%;
            font-family: Roboto, sans-serif;
            padding: 0;
            display: flex;
            align-items: start;
            cursor: pointer;
            background: transparent;
            text-align: left;
          }
  
          .preview:hover {
            background: rgba(var(--color-dark), 0.05);
          }
  
          .preview__image {
            width: 48px;
            height: 70px;
            object-fit: cover;
            margin: 0.5rem;
          }
  
          .preview__info {
            padding: 0.5rem;
          }
  
          .preview__title {
            margin: 0;
            font-size: 1rem;
            font-weight: bold;
            color: rgba(var(--color-dark), 0.8);
          }
  
          .preview__author {
            color: rgba(var(--color-dark), 0.6);
          }
        </style>
  
        <button class="preview" data-preview="${bookId}">
          <img class="preview__image" src="${image}" />
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${author}</div>
          </div>
        </button>
      `;
    }
  
    addEventListeners() {
      const button = this.shadowRoot.querySelector('.preview');
      button.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('preview-click', {
          bubbles: true,
          composed: true,
          detail: { bookId: this.getAttribute('book-id') }
        }));
      });
    }
  }
  
  /**
   * Web Component for the book list
   */
  class BookList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.books = [];
      this.page = 1;
      this.booksPerPage = 36;
    }
  
    static get observedAttributes() {
      return ['books-per-page'];
    }
  
    set bookData(books) {
      this.books = books;
      this.render();
    }
  
    connectedCallback() {
      this.render();
      this.setupShowMoreButton();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'books-per-page' && oldValue !== newValue) {
        this.booksPerPage = parseInt(newValue, 10);
        this.render();
      }
    }
  
    render() {
      const start = (this.page - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;
      const displayedBooks = this.books.slice(start, end);
      const remaining = this.books.length - (this.page * this.booksPerPage);
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
  
          .list__items {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            padding: 1rem;
          }
  
          .list__message {
            display: none;
            padding: 1rem;
            text-align: center;
          }
  
          .list__message.show {
            display: block;
          }
  
          .list__button {
            display: block;
            padding: 1rem;
            width: 100%;
            border: 0;
            font-family: Roboto, sans-serif;
            cursor: pointer;
            background: rgba(var(--color-dark), 0.1);
          }
  
          .list__button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }
        </style>
  
        <div class="list__items"></div>
        <div class="list__message">No results found. Your filters might be too narrow.</div>
        <button class="list__button" ?disabled="${remaining <= 0}">
          <span>Show more</span>
          <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
        </button>
      `;
  
      const container = this.shadowRoot.querySelector('.list__items');
      displayedBooks.forEach(book => {
        const preview = document.createElement('book-preview');
        preview.setAttribute('book-id', book.id);
        preview.setAttribute('image', book.image);
        preview.setAttribute('title', book.title);
        preview.setAttribute('author', book.author);
        container.appendChild(preview);
      });
    }
  
    setupShowMoreButton() {
      const button = this.shadowRoot.querySelector('.list__button');
      button.addEventListener('click', () => {
        this.page++;
        this.render();
        this.dispatchEvent(new CustomEvent('load-more'));
      });
    }
  
    showMessage(show) {
      const message = this.shadowRoot.querySelector('.list__message');
      message.classList.toggle('show', show);
    }
  }
  
  /**
   * Web Component for the search overlay
   */
  class SearchOverlay extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(var(--color-light), 0.9);
            z-index: 10;
          }
  
          :host([open]) {
            display: block;
          }
  
          .overlay__content {
            background: rgb(var(--color-light));
            border-radius: 0.5rem;
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
          }
  
          .overlay__form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
  
          .overlay__field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
  
          .overlay__input {
            padding: 0.5rem;
            border: 1px solid rgba(var(--color-dark), 0.2);
            border-radius: 0.25rem;
          }
  
          .overlay__buttons {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1rem;
          }
  
          .overlay__button {
            padding: 0.5rem 1rem;
            border: 0;
            border-radius: 0.25rem;
            cursor: pointer;
          }
  
          .overlay__button--primary {
            background: rgba(var(--color-dark), 0.8);
            color: rgb(var(--color-light));
          }
        </style>
  
        <div class="overlay__content">
          <form class="overlay__form">
            <label class="overlay__field">
              <span>Title</span>
              <input class="overlay__input" name="title" placeholder="Any">
            </label>
  
            <label class="overlay__field">
              <span>Genre</span>
              <select class="overlay__input" name="genre">
                <slot name="genres"></slot>
              </select>
            </label>
  
            <label class="overlay__field">
              <span>Author</span>
              <select class="overlay__input" name="author">
                <slot name="authors"></slot>
              </select>
            </label>
  
            <div class="overlay__buttons">
              <button type="button" class="overlay__button" data-action="cancel">Cancel</button>
              <button type="submit" class="overlay__button overlay__button--primary">Search</button>
            </div>
          </form>
        </div>
      `;
    }
  
    setupEventListeners() {
      const form = this.shadowRoot.querySelector('form');
      const cancelButton = this.shadowRoot.querySelector('[data-action="cancel"]');
  
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const filters = Object.fromEntries(formData);
        
        this.dispatchEvent(new CustomEvent('search', {
          detail: filters,
          bubbles: true,
          composed: true
        }));
        
        this.removeAttribute('open');
      });
  
      cancelButton.addEventListener('click', () => {
        this.removeAttribute('open');
      });
    }
  }
  
  // Register Web Components
  customElements.define('book-preview', BookPreview);
  customElements.define('book-list', BookList);
  customElements.define('search-overlay', SearchOverlay);
  
  export { BookPreview, BookList, SearchOverlay };
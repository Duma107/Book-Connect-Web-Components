class BookListManager {
    constructor(state, domHandler) {
        this.state = state;
        this.domHandler = domHandler;
    }

    renderBookList(books) {
        const fragment = document.createDocumentFragment();
        const start = (this.state.page - 1) * this.state.BOOKS_PER_PAGE;
        const end = start + this.state.BOOKS_PER_PAGE;

        for (const book of books.slice(start, end)) {
            // Create book-preview element instead of the old preview
            const element = document.createElement('book-preview');
            element.setAttribute('book-id', book.id);
            element.setAttribute('title', book.title);
            element.setAttribute('author', this.state.authors[book.author]);
            element.setAttribute('image', book.image);
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
  customElements.define('booklist', BookListManager);
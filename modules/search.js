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
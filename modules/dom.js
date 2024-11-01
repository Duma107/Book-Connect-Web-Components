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
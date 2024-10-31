Book Connect: A Modular Book Browsing Application
Welcome to Book Connect - a modular book browsing application designed to provide users with a smooth book discovery experience while showcasing clean code and thoughtful abstraction principles.

Overview
Book Connect allows users to browse a diverse collection of books, search by genre or author, and customize the visual theme for an optimized reading experience. This project focuses on organizing code using object-oriented principles, simplifying future modifications, and enhancing readability.

Table of Contents
Features
Project Structure
Installation
Usage
Modules Overview
Contributing
License
Features
Modular Book Management: Organize books, authors, and genres effectively with the ability to paginate book listings.
Search & Filter: Easily find books by genre, author, or title using an intuitive search form.
Dynamic Theme Customization: Users can toggle between light and dark themes based on preference.
Abstraction & Modularity: The codebase is structured using OOP principles, allowing for seamless refactoring and scalability.
Project Structure
This project is divided into modular components to ensure code readability, maintainability, and extensibility:

bash
Copy code
- modules/
  - state.js            # Handles application state (books, authors, genres, pagination)
  - dom.js              # Manages DOM manipulation and dynamic element creation
  - bookList.js         # Manages book listings, pagination, and list rendering
  - search.js           # Manages search and filter functionality
  - theme.js            # Handles theme selection and application
- app.js                # Main application initialization and event listener setup
- data.js               # Data storage for books, authors, genres, and configuration
Installation
Clone this repository:
bash
Copy code
git clone https://github.com/username/book-connect.git
Navigate into the project directory:
bash
Copy code
cd book-connect
Open index.html in your preferred browser to run the app.
Usage
Browse Books: Use pagination controls to explore the full catalog.
Search by Genre/Author: Open the search form and select desired filters.
Change Theme: Open the settings menu and switch between light and dark themes.
Modules Overview
1. state.js
Manages the application's state, including books, authors, genres, pagination settings, and search results.

2. dom.js
Contains utility functions for creating and updating DOM elements, including:

createBookPreview(book, authors): Generates book preview buttons.
createOptionElement(value, text): Creates dropdown options for filters.
3. bookList.js
Responsible for rendering books and handling pagination:

renderBookList(books): Renders a paginated list of books.
updateShowMoreButton(): Updates pagination controls based on remaining items.
4. search.js
Handles search and filtering functionality:

setupSearchForm(): Initializes search form and dropdowns.
handleSearch(filters): Filters book list based on user-selected criteria.
5. theme.js
Applies user-selected themes (light or dark) by adjusting root CSS variables.

6. app.js
Main entry point of the app. Initializes the application state, sets up event listeners, and coordinates different modules.

Contributing
To contribute to this project:

Fork the repository.
Create a new branch.
Make your changes and create a pull request.
License
This project is licensed under the MIT License. See LICENSE for details.

Happy coding, and enjoy discovering books with Book Connect! 📚

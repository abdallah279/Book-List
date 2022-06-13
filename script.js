// Book Class: Represents a Book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><span class="btn btn-danger delete">x</span></td>
        `;

        list.appendChild(row);
    }

    static showAleret(message, className){
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");

        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(()=>{

            document.querySelector(".alert").remove();

        }, 3000);

    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();

            // Show success message
            UI.showAleret("Book Removed", "success");
        }
    }

    static emptyFileds(){
        document.querySelector("#title").value = '';
        document.querySelector("#author").value = '';
        document.querySelector("#isbn").value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
      let books;

      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }

      return books;
    }

    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
      const books = Store.getBooks();

      books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }
      });

      localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
const form = document.querySelector("#book-form");

form.addEventListener("submit", (e)=>{

    // Prevent actual submit
    e.preventDefault();

    // Get form values
    let title = document.querySelector("#title").value;
    let author = document.querySelector("#author").value;
    let isbn = document.querySelector("#isbn").value;

    // Validate
    if(title === "" || author === "" || isbn === ""){

        // Show success message
        UI.showAleret("Please fill in all fields", "danger");

    } else{

        // Instatiate book
        let book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add Book To Store
        Store.addBook(book);

        // Show success message
        UI.showAleret("Book Added", "success");

        // Clear fields
        UI.emptyFileds();
    }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e)=>{

    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book From Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

});
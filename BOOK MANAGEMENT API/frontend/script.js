const container = document.getElementById("books-container");

fetch("http://127.0.0.1:5000/books")

    .then(response => response.json())

    .then(books => {

        books.forEach(book => {

            const bookElement = document.createElement("div");
            bookElement.classList.add("book-card")
            bookElement.innerHTML = `
                <h3>BOOK ID : ${book.id}</h3>
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Price: ₹${book.price}</p>
            `;

            container.appendChild(bookElement);

        });

    })

    .catch(error => {

        console.log("Error:", error);

    });

const form = document.getElementById("book-form");

const message = document.getElementById("message");

// add new book
form.addEventListener("submit", function (event) {

    event.preventDefault();


    const title = document.getElementById("title").value;

    const author = document.getElementById("author").value;

    const price = Number(document.getElementById("price").value);


    const newBook = {
        title: title,
        author: author,
        price: price
    };


    fetch("http://127.0.0.1:5000/books", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(newBook)

    })

        .then(response => response.json())

        .then(data => {

            console.log(data);

            message.textContent = data.message;

            form.reset();

        })

        .catch(error => {

            console.log("Error:", error);

            message.textContent = "Something went wrong";

        });

});

// get new book
const getBookForm = document.getElementById("get-book-form");

getBookForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const bookId = document.getElementById("get-book-id").value;

    fetch(`http://127.0.0.1:5000/books/${bookId}`)

        .then(response => {
            if (!response.ok) {
                throw new Error("Book not found");
            }
            return response.json();
        })

        .then(data => {

            const result = document.getElementById("get-book-result");


            result.innerHTML = `
                <h3>${data.title}</h3>
                <p>Author: ${data.author}</p>
                <p>Price: ₹${data.price}</p>
            `;

        })

        .catch(error => {

            const result = document.getElementById("get-book-result");

            result.innerHTML = `
                <p>Error :${error.message} ,404</p>
            `;


        });

});

// update book
const updateBookForm = document.getElementById("update-book-form");

updateBookForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const bookId = document.getElementById("update-book-id").value;

    const title = document.getElementById("update-title").value;

    const author = document.getElementById("update-author").value;

    const price = Number(document.getElementById("update-price").value);


    const updatedBook = {
        title: title,
        author: author,
        price: price
    };


    fetch(`http://127.0.0.1:5000/books/${bookId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedBook)

    })

        .then(async response => {
            const data= await response.json()

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;

        })

        .then(data => {

            console.log(data);

            document.getElementById("update-book-message").textContent =
                data.message;

        })

        .catch(error => {

            document.getElementById("update-book-message").textContent =
                error.message;

        });

});

// delete  book
const deleteBookForm = document.getElementById("delete-book-form");

deleteBookForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const bookId = document.getElementById("delete-book-id").value;

    fetch(`http://127.0.0.1:5000/books/${bookId}`, {
        method: "DELETE",

        // headers: {
        //     "Content-Type": "application/json"
        // },

        // body: JSON.stringify(updatedBook)
    })

        .then(response => {
            if (!response.ok) {
                throw new Error("Book not found");
            }
            return response.json();
        })

        .then(data => {

            const result = document.getElementById("delete-book-message");


            result.innerHTML = `
                
                <p>Book deleted successfully</p>
            `;

        })

        .catch(error => {

            const result = document.getElementById("delete-book-message");

            result.innerHTML = `
                <p>Error :${error.message} ,404</p>
            `;


        });

});

// patch book
const patchBookForm = document.getElementById("patch-book-form");

patchBookForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const bookId = document.getElementById("patch-book-id").value;

    const title = document.getElementById("patch-title").value;

    const author = document.getElementById("patch-author").value;

    const price = document.getElementById("patch-price").value;


    const patchBook = {};
    if (title.trim() !== "") {
        patchBook.title = title;
    }
    if (author.trim() !== "") {
        patchBook.author = author;
    }
    if (price !== "") {
        patchBook.price = Number(price);
    }
    if (Object.keys(patchBook).length === 0) {
        document.getElementById("patch-book-message").textContent = "Please enter at least one field to update."
        return;
    }



    fetch(`http://127.0.0.1:5000/books/${bookId}`, {

        method: "PATCH",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(patchBook)

    })

        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;

        })

        .then(data => {

            console.log(data);

            document.getElementById("patch-book-message").textContent =
                data.message;

        })

        .catch(error => {

            document.getElementById("patch-book-message").textContent =
                error.message;

        });

});
fetch("http://127.0.0.1:5000/books")

    .then(response => response.json())

    .then(books => {

        const container = document.getElementById("books-container");

        books.forEach(book => {

            const bookElement = document.createElement("div");

            bookElement.innerHTML = `
                        <h3>BOOK ID : ${book.id}</h3>
                        <h2>Book Title :${book.title}</h2>
                        <p>Author: ${book.author}</p>
                        <p>Price: ₹${book.price}</p>
                    `;

            container.appendChild(bookElement);

        });

    })

    .catch(error => {

        console.log("Error:", error);

    });

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)
FILENAME = "books_library.json"


def load_books():
    if not os.path.exists(FILENAME):
        books = [
            {
                "id": 1, 
                "title": "Python Basics",
                "author": "John Smith",
                "price": 499,
            },
            {
                "id": 2,
                "title": "Learn Flask",
                "author": "David Miller",
                "price": 599,
            },
        ]
        save_books(books)
        return books
    with open(FILENAME, "r") as file:
        return json.load(file)


def save_books(books):
    with open(FILENAME, "w") as file:
        json.dump(books, file, indent=4)


# GET all books
@app.route("/books", methods=["GET"])
def get_books():
    books = load_books()
    return jsonify(books)


# get book by id
@app.route("/books/<int:book_id>", methods=["GET"])
def get_book(book_id):
    books = load_books()
    for book in books:
        if book["id"] == book_id:
            return jsonify(book)

    return jsonify({"message": "book not found"}), 404


#  post new book
@app.route("/books", methods=["POST"])
def add_book():
    books = load_books()
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400
    allowed_fields = {"title", "author", "price"}
    for field in data:
        if field not in allowed_fields:
            return jsonify({"message": "unexpected  field", "field": field}), 400
    if "title" not in data or "author" not in data or "price" not in data:
        return jsonify({"message": "title, author and price are required"}), 400
    if data["title"].strip() == "":
        return jsonify({"message": "Title cannot be empty"}), 400
    if data["author"].strip() == "":
        return jsonify({"message": "Author cannot be empty"}), 400
    if not isinstance(data["price"], (int, float)):
        return jsonify({"message": "price should be number, not a string"}), 400
    if data["price"] <= 0:
        return (
            jsonify(
                {"message": "price should be greater than zero and a positive number"}
            ),
            400,
        )

    # generate new book id
    if len(books) == 0:
        new_id = 1
    else:
        new_id = max(book["id"] for book in books) + 1
    new_book = {
        "id": new_id,
        "author": data["author"],
        "title": data["title"],
        "price": data["price"],
    }
    books.append(new_book)
    save_books(books)
    return jsonify({"message": "New book added sucessfully !", "book": new_book}), 201


# PUT- update book data
@app.route("/books/<int:book_id>", methods=["PUT"])
def updated_book(book_id):
    books = load_books()
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400
    allowed_fields = {"title", "author", "price"}
    for field in data:
        if field not in allowed_fields:
                return jsonify({"message": "unexpected  field", "field": field}), 400
    if "title" not in data or "author" not in data or "price" not in data:
            return jsonify({"message": "title, author and price are required"}), 400
    if data["title"].strip() == "":
        return jsonify({"message": "Title cannot be empty"}), 400
    if data["author"].strip() == "":
        return jsonify({"message": "Author cannot be empty"}), 400
    if not isinstance(data["price"], (int, float)):
        return jsonify({"message": "price should be number, not a string"}), 400
    if data["price"] <= 0:
        return (
            jsonify(
                {"message": "price should be greater than zero and a positive number"}
            ),
            400,
        )

    for book in books:
        if book["id"] == book_id:
            book["author"] = data["author"]
            book["title"] = data["title"]
            book["price"] = data["price"]
            save_books(books)
            return jsonify({"message": "book updated successfully", "book": book}),200
    return jsonify({"message": "book not found"}),404
# PATCH - update sepcific field
@app.route("/books/<int:book_id>",methods=["PATCH"])
def patch_book(book_id):
    books=load_books()
    data= request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400
    allowed_fields = {"title", "author", "price"}
    for field in data:
        if field not in allowed_fields:
                return jsonify({"message": "unexpected  field", "field": field}), 400
    if "title" in data:
        if not isinstance(data["title"], str) or data["title"].strip() == "":
            return jsonify({"message": "Invalid title"}), 400

    if "author" in data:
        if not isinstance(data["author"], str) or data["author"].strip() == "":
            return jsonify({"message": "Invalid author"}), 400

    if "price" in data:
        if not isinstance(data["price"], (int, float)) or data["price"] <= 0:
            return jsonify({"message": "Invalid price"}), 400
    for book in books:
        if book["id"]==book_id:
            if "title" in data:
                book["title"] = data["title"]
            if "author" in data:
                book["author"] = data["author"]
            if "price" in data:
                book["price"] = data["price"]
            save_books(books)
            return jsonify({"message": "book updated successfully", "book": book}),200
    return jsonify({"message": "book not found"}),404

# DELETE - remove book
@app.route("/books/<int:book_id>", methods=["DELETE"])
def remove_book(book_id):
    books = load_books()
    for book in books:
        if book["id"] == book_id:
            books.remove(book)
            save_books(books)
            return jsonify({"message": "book removed successfully", "book": book}),200
    return jsonify({"message": "book not found"}), 404


# run server
if __name__ == "__main__":
    app.run(debug=True)

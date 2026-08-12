import requests

url = "http://127.0.0.1:5000/books/4"
updated_book = {
    "price": 799,
    "password": "123"
}
reponse = requests.patch(url,json=updated_book)
print(reponse.json())

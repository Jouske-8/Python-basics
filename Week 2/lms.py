# Library Management Mini CLI
import json
import os

FILE_NAME = 'library.json'


class Library:
    def __init__(self):
        self.books = self.load_data()
    
    def load_data(self):
        if os.path.exists(FILE_NAME):
            with open(FILE_NAME, 'r') as file:
                return json.load(file)
        return []
    
    def save_data(self):
        with open(FILE_NAME, 'w') as file:
            json.dump(self.books, file, indent=4)
    
    def add_book(self): 
        title = input("Enter book title: ")
        author = input("Enter book author: ")
        self.books.append({
            "title": title, 
            "author": author,
            "issued": False
        })
        self.save_data()
        print("Book added successfully.")
    
    def view_books(self):
        if not self.books:
            print("No books in the library.")
            return
        
        print("Books in the library:")
        for i, book in enumerate(self.books, start=1):
            status = "Issued" if book["issued"] else "Available"
            print(f"{i}. {book['title']} by {book['author']} ({status})")
    
    def remove_book(self):
        title = input("Enter the title of the book to remove: ")

        for book in self.books:
            if book["title"].lower() == title.lower():
                self.books.remove(book)
                self.save_data()
                print("Book removed successfully.")
                return
        print("Book not found.")

    def issue_book(self):
        title = input("Enter the title of the book to issue: ")

        for book in self.books:
            if book["title"].lower() == title.lower():
                if not book["issued"]:
                    book["issued"] = True
                    self.save_data()
                    print("Book issued successfully.")
                else:
                    print("Book is already issued.")
                return
        print("Book not found.")
    
    def return_book(self):
        title = input("Enter the title of the book to return: ")

        for book in self.books:
            if book["title"].lower() == title.lower():
                if book["issued"]:
                    book["issued"] = False
                    self.save_data()
                    print("Book returned successfully.")
                else:
                    print("Book was not issued.")
                return
        print("Book not found.")

def main():
    library = Library()

    while True:
        print("\n===== Library Management System =====")
        print("1. Add Book")
        print("2. View Books")
        print("3. Remove Book")
        print("4. Issue Book")
        print("5. Return Book")
        print("6. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            library.add_book()
        elif choice == "2":
            library.view_books()
        elif choice == "3":
            library.remove_book()
        elif choice == "4":
            library.issue_book()
        elif choice == "5":
            library.return_book()
        elif choice == "6":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Try again.")


if __name__ == "__main__":
    main()
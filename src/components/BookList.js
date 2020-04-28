import React, { Component } from "react";

import "../App.css";
import Book from "./Book";

class BookList extends Component {
  render() {
    const { books, onShelfChange } = this.props;
    return (
      <div className="bookshelf-books">
        <ol className="books-grid">
          {Object.keys(books).map((bookId) => (
            <Book
              key={bookId}
              book={books[bookId]}
              onShelfChange={onShelfChange}
            />
          ))}
        </ol>
      </div>
    );
  }
}

export default BookList;

import React, { Component } from "react";

import "../App.css";

class Book extends Component {
  render() {
    const { book, onShelfChange } = this.props;
    const { imageLinks, title, authors, shelf } = book;
    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: `url("${imageLinks.thumbnail}")`,
              }}
            />
            <div className="book-shelf-changer">
              <select
                value={shelf || "none"}
                onChange={(e) => onShelfChange(book, e.target.value)}
              >
                <option value="move" disabled>
                  Move to...
                </option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">{title}</div>
          {authors.map((author) => (
            <div key={author} className="book-authors">
              {author}
            </div>
          ))}
        </div>
      </li>
    );
  }
}

export default Book;

import React from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";
import { getAll, update, search, get } from "./BooksAPI";
import BookList from "./components/BookList";

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    shelf: {},
    isLoading: true,
    searchResults: {},
  };

  componentDidMount() {
    this.onMount();
  }

  onMount = async () => {
    this.setState({ isLoading: true });
    const res = await getAll();
    const normalizedRes = {
      currentlyReading: {},
      wantToRead: {},
      read: {},
    };
    res.forEach((resItem) => {
      normalizedRes[resItem.shelf][resItem.id] = resItem;
    });
    this.setState({
      shelf: normalizedRes,
      isLoading: false,
      originalShelf: res,
    });
  };

  updateMainShelf = (res, book, shelf, present = true) => {
    const updatedShelf = Object.assign({}, this.state.shelf);
    if (present) {
      delete updatedShelf[book.shelf][book.id];
    }
    if (shelf !== "none") {
      updatedShelf[res.shelf] = {
        ...updatedShelf[res.shelf],
        [res.id]: res,
      };
    }
    this.setState({ shelf: updatedShelf });
  };

  onShelfChange = async (book, shelf) => {
    try {
      await update(book, shelf);
      const res = await get(book.id);
      this.updateMainShelf(res, book, shelf);
    } catch (err) {
      console.log("error changing shelf: ", err);
    }
  };

  updateSearchShelf = (res) => {
    const updatedShelf = Object.assign({}, this.state.searchResults);
    updatedShelf[res.id].shelf = res.shelf;
    this.setState({ searchResults: updatedShelf });
  };

  onShelfChangeSearch = async (book, shelf) => {
    try {
      await update(book, shelf);
      const res = await get(book.id);
      this.updateSearchShelf(res);
      this.updateMainShelf(res, book, shelf, false);
    } catch (err) {
      console.log("error changing shelf: ", err);
    }
  };

  onSearchChange = async (e) => {
    const res = await search(e.target.value);
    if (!res || res.error) {
      return;
    }
    const normalizedRes = {};
    res.forEach((resItem) => {
      normalizedRes[resItem.id] = resItem;
    });
    this.setState({
      searchResults: normalizedRes,
    });
  };

  render() {
    const { isLoading, shelf, showSearchPage, searchResults } = this.state;
    const { currentlyReading, wantToRead, read } = shelf;

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div className="app">
        {showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button
                className="close-search"
                onClick={() =>
                  this.setState({ searchResults: {}, showSearchPage: false })
                }
              >
                Close
              </button>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  onChange={this.onSearchChange}
                />
              </div>
            </div>
            <div className="search-books-results">
              <BookList
                books={searchResults}
                onShelfChange={this.onShelfChangeSearch}
              />
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <BookList
                    books={currentlyReading}
                    onShelfChange={this.onShelfChange}
                  />
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <BookList
                    books={wantToRead}
                    onShelfChange={this.onShelfChange}
                  />
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <BookList books={read} onShelfChange={this.onShelfChange} />
                </div>
              </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;

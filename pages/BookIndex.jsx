import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { bookService } from "../services/book.service.js"

const { useEffect, useState } = React
const { Link } = ReactRouterDOM

export function BookIndex() {
  const [books, setBooks] = useState(null)
  const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter())

  useEffect(() => {
    loadBooks()
  }, [filterBy])

  function loadBooks() {
    bookService
      .query(filterBy)
      .then(setBooks)
      .catch(err => {
        console.log("Error occurred while getting books:", err)
      })
  }

  function onRemoveBook(bookId) {
    bookService
      .remove(bookId)
      .then(() => {
        setBooks(books => books.filter(book => book.id !== bookId))
      })
      .catch(err => {
        console.log("Error occurred while removing books:", err)
      })
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  if (!books) return <div>Loading...</div>
  return (
    <section className="book-index">
      <BookFilter
        filterBy={filterBy}
        onSetFilterBy={onSetFilterBy}
      ></BookFilter>
      <hr />
      <section className="add-book-button-container">
        <button>
          <Link to="/book/edit">Add New Book</Link>
        </button>
      </section>
      <BookList books={books} onRemoveBook={onRemoveBook} />
    </section>
  )
}

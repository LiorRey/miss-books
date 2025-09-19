import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { bookService } from "../services/book.service.js"
import { utilService } from "../services/util.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"

const { useEffect, useState } = React
const { Link, useSearchParams } = ReactRouterDOM

export function BookIndex() {
  const [books, setBooks] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(
    bookService.getFilterFromSearchParams(searchParams)
  )

  useEffect(() => {
    setSearchParams(utilService.getTruthyValues(filterBy))
    loadBooks()
  }, [filterBy])

  function loadBooks() {
    bookService
      .query(filterBy)
      .then(setBooks)
      .catch(err => {
        console.log("Error occurred while getting books:", err)
        showErrorMsg("Error occurred while getting books")
      })
  }

  function onRemoveBook(bookId) {
    bookService
      .remove(bookId)
      .then(() => {
        setBooks(books => books.filter(book => book.id !== bookId))
        showSuccessMsg("Book removed successfully!")
      })
      .catch(err => {
        console.log("Error occurred while removing books:", err)
        showErrorMsg("Error occurred while removing books")
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

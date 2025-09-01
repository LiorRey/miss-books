import { BookList } from "../cmps/BookList.jsx"
import { bookService } from "../services/book.service.js"

const { useEffect, useState } = React

export function BookIndex() {
  const [books, setBooks] = useState(null)

  useEffect(() => {
    loadBooks()
  }, [])

  function loadBooks() {
    bookService
      .query()
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

  if (!books) return <div>Loading...</div>
  return (
    <section className="book-index">
      <BookList books={books} onRemoveBook={onRemoveBook} />
    </section>
  )
}

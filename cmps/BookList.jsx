import { BookPreview } from "./BookPreview.jsx"

const { Link } = ReactRouterDOM

export function BookList({ books, onRemoveBook }) {
  return (
    <section className="book-list">
      {books.map(book => (
        <article key={book.id}>
          <BookPreview book={book} />
          <section className="book-list-actions-container">
            <button>
              <Link to={`/book/${book.id}`}>Details</Link>
            </button>
            <button>Edit</button>
            <button onClick={() => onRemoveBook(book.id)}>Remove</button>
          </section>
        </article>
      ))}
    </section>
  )
}

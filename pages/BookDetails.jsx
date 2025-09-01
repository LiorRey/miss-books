import { bookService } from "../services/book.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function BookDetails() {
  const [book, setBook] = useState(null)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadBook()
  }, [params.bookId])

  const { title, listPrice } = book
  const { amount, currencyCode, isOnSale } = listPrice

  function loadBook() {
    bookService
      .get(params.bookId)
      .then(book => setBook(book))
      .catch(err => console.log("Error while loading a book:", err))
  }

  function onBack() {
    navigate("/book")
  }

  if (!book) return <div>Loading...</div>
  return (
    <section className="book-details">
      <h1>Book Title: {title}</h1>
      <h1>
        Book Price: {amount} {currencyCode}
      </h1>
      <h1>On Sale: {isOnSale}</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam non
        excepturi ratione maxime doloremque. Dolore possimus, eaque, blanditiis
        neque quos quis ad error accusantium libero labore atque ab id ratione?
      </p>
      {/* <img src={imageSrc} title={title} alt={`Image of: ${title}`} /> */}
      <button onClick={onBack}>Back</button>
      <section>
        <button>
          <Link to={`/book/${book.prevBookId}`}>Prev</Link>
        </button>
        <button>
          <Link to={`/book/${book.nextBookId}`}>Next</Link>
        </button>
        <button></button>
      </section>
    </section>
  )
}

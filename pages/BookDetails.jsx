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

  const { title, listPrice, thumbnail } = book
  const { amount, currencyCode, isOnSale } = listPrice
  console.log(thumbnail)
  return (
    <section className="book-details">
      <h2>Title: {title}</h2>
      <h1>
        Price: {amount} {currencyCode}
      </h1>
      <h1>{isOnSale && "On Sale!"}</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam non
        excepturi ratione maxime doloremque. Dolore possimus, eaque, blanditiis
        neque quos quis ad error accusantium libero labore atque ab id ratione?
      </p>
      <div className="book-details-image-and-actions-container">
        <img src={thumbnail} title={title} alt={`Image of: ${title}`} />
        <section className="book-details-actions-container">
          <button onClick={onBack}>Back</button>
          <div>
            <button>
              <Link to={`/book/${book.prevBookId}`}>Prev</Link>
            </button>
            <button>
              <Link to={`/book/${book.nextBookId}`}>Next</Link>
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}

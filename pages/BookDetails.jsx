import { LongTxt } from "../cmps/LongTxt.jsx"
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

  const {
    title,
    subtitle,
    authors,
    publishedDate,
    description,
    pageCount,
    categories,
    listPrice,
    thumbnail,
    language,
  } = book
  const { amount, currencyCode, isOnSale } = listPrice
  const languageName = new Intl.DisplayNames(["en"], {
    type: "language",
  })

  return (
    <section className="book-details">
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

      <div className="book-details-info-container">
        <div className="book-details-title-and-subtitle-container">
          <h1>{title}</h1>
          <h3>{subtitle}</h3>
        </div>
        <h3>
          Authors:
          <br />
          {authors.join(", ")}
        </h3>
        <h3>
          Publish Year:
          <br />
          {publishedDate}
          {bookService.getSeniorityLabelForBook(publishedDate)}
        </h3>
        <LongTxt txt={description} length={100} />
        <h3>
          Page Count:
          <br />
          {pageCount}
          {bookService.getTypeReadingLabelForBook(pageCount)}
        </h3>
        <h3>
          Categories:
          <br />
          {categories.join(", ")}
        </h3>
        <h3>
          Language:
          <br />
          {languageName.of(language)}
        </h3>
        <h3 className={bookService.getStyleClassNameForAmountText(amount)}>
          Price:
          <br />
          {amount} {currencyCode}
        </h3>
        {isOnSale && <h1 className="on-sale-animation">On Sale!</h1>}
      </div>
    </section>
  )
}

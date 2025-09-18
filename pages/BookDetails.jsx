import { LongTxt } from "../cmps/LongTxt.jsx"
import { AddReview } from "../cmps/AddReview.jsx"
import { ReviewList } from "../cmps/ReviewList.jsx"
import { bookService } from "../services/book.service.js"
import { utilService } from "../services/util.service.js"

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

  function getSeniorityLabelForBook(publishedDate) {
    const currentYear = new Date().getFullYear()
    const yearsSincePublish = currentYear - publishedDate
    if (yearsSincePublish > 10) return " (Vintage)"
    if (yearsSincePublish < 1) return " (New)"
    return ""
  }

  function getTypeReadingLabelForBook(pageCount) {
    if (pageCount > 500) return " (Serious Reading)"
    if (pageCount > 200) return " (Descent Reading)"
    if (pageCount < 100) return " (Light Reading)"
    return ""
  }

  function onAddReview(reviewToAdd) {
    bookService
      .addReview(book.id, reviewToAdd)
      .then(() => {
        setBook(prevBook => ({
          ...prevBook,
          reviews: [reviewToAdd, ...prevBook.reviews],
        }))
        showSuccessMsg("Review added successfully!")
      })
      .catch(err => {
        console.log("Error while adding a review:", err)
        showErrorMsg("Error while adding a review")
      })
  }

  function onRemoveReview(reviewId) {
    bookService
      .removeReview(book.id, reviewId)
      .then(() => {
        setBook(prevBook => ({
          ...prevBook,
          reviews: prevBook.reviews.filter(review => review.id !== reviewId),
        }))
        showSuccessMsg("Review removed successfully!")
      })
      .catch(err => {
        console.log("Error occurred while removing reviews:", err)
        showErrorMsg("Error occurred while removing reviews")
      })
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
    reviews,
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
          {getSeniorityLabelForBook(publishedDate)}
        </h3>
        <LongTxt txt={description} length={100} />
        <h3>
          Page Count:
          <br />
          {pageCount}
          {getTypeReadingLabelForBook(pageCount)}
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
        <h3 className={utilService.getStyleClassNameForAmountText(amount)}>
          Price:
          <br />
          {amount} {currencyCode}
        </h3>
        {isOnSale && <h1 className="on-sale-animation">On Sale!</h1>}
      </div>
      <section className="reviews-add-and-list-container">
        <AddReview addReview={onAddReview} />
        <div className="review-list-container">
          <h2>Reviews</h2>
          <div className="review-list-scrollable">
            <ReviewList reviews={reviews} removeReview={onRemoveReview} />
          </div>
        </div>
      </section>
    </section>
  )
}

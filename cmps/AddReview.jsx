import { bookService } from "../services/book.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"

const { useState } = React

function getTodayLocalDate() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd}` // Format for <input type="date">
}

export function AddReview({ bookId, onReviewAdded }) {
  const [reviewToAdd, setReviewToAdd] = useState({
    fullname: "",
    rating: 0,
    readAt: getTodayLocalDate(),
  })

  function handleChange({ target }) {
    const { value, name: field } = target

    setReviewToAdd(prevReview => ({ ...prevReview, [field]: value }))
  }

  function handleRatingChange(selectedRating) {
    setReviewToAdd(prevReview => ({ ...prevReview, rating: selectedRating }))
  }

  function onAddReview(ev) {
    ev.preventDefault()

    bookService
      .addReview(bookId, reviewToAdd)
      .then(() => {
        showSuccessMsg("Review added successfully!")
        setReviewToAdd({
          fullname: "",
          rating: 0,
          readAt: getTodayLocalDate(),
        })
        onReviewAdded()
      })
      .catch(err => {
        console.log("Error while adding a review:", err)
        showErrorMsg("Error while adding a review")
      })
  }

  return (
    <section className="add-review">
      <h2>Add Review</h2>
      <form onSubmit={onAddReview}>
        <div>
          <label htmlFor="fullname">
            <h3>Full Name:</h3>
          </label>
          <input
            onChange={handleChange}
            type="text"
            value={reviewToAdd.fullname}
            name="fullname"
            id="fullname"
            maxLength="14"
          />
        </div>

        <div>
          <label htmlFor="rating">
            <h3>Rating:</h3>
          </label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(num => (
              <span
                key={num}
                className={num <= reviewToAdd.rating ? "star filled" : "star"}
                onClick={() => handleRatingChange(num)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="read-at">
            <h3>Reat At:</h3>
          </label>
          <input
            onChange={handleChange}
            type="date"
            value={reviewToAdd.readAt}
            name="readAt"
            id="read-at"
          />
        </div>

        <button type="submit">Add Review</button>

        <hr />
      </form>
    </section>
  )
}

import { RatingDynamicCmp } from "./dynamic-inputs/RatingDynamicCmp.jsx"

const { useState } = React

function getTodayLocalDate() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd}` // Format for <input type="date">
}

export function AddReview({ addReview }) {
  const [reviewToAdd, setReviewToAdd] = useState(getEmptyReview())
  const [ratingCmpType, setRatingCmpType] = useState("select")

  function getEmptyReview() {
    return {
      fullname: "",
      rating: 1,
      readAt: getTodayLocalDate(),
    }
  }

  function handleChange({ target }) {
    const { value, name: field } = target

    setReviewToAdd(prevReview => ({ ...prevReview, [field]: value }))
  }

  function handleRatingChange(selectedRating) {
    setReviewToAdd(prevReview => ({ ...prevReview, rating: selectedRating }))
  }

  function onAddReview(ev) {
    ev.preventDefault()
    addReview(reviewToAdd)
    setReviewToAdd(getEmptyReview())
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

        <div className="rating-container">
          <label htmlFor="rating">
            <h3>Rating:</h3>
          </label>
          <div className="rating-inputs-container">
            <div className="rating-radio-buttons-container">
              <div>
                <input
                  onChange={ev => setRatingCmpType(ev.target.value)}
                  type="radio"
                  value="select"
                  name="ratingType"
                  id="select"
                  checked={ratingCmpType === "select"}
                />
                <label htmlFor="select">
                  <h4>By Select</h4>
                </label>
              </div>
              <div>
                <input
                  onChange={ev => setRatingCmpType(ev.target.value)}
                  type="radio"
                  value="textbox"
                  name="ratingType"
                  id="textbox"
                  checked={ratingCmpType === "textbox"}
                />
                <label htmlFor="textbox">
                  <h4>By Textbox</h4>
                </label>
              </div>
              <div>
                <input
                  onChange={ev => setRatingCmpType(ev.target.value)}
                  type="radio"
                  value="stars"
                  name="ratingType"
                  id="stars"
                  checked={ratingCmpType === "stars"}
                />
                <label htmlFor="stars">
                  <h4>By Stars</h4>
                </label>
              </div>
            </div>
            <div className="rating-dynamic-cmp-container">
              <RatingDynamicCmp
                val={reviewToAdd.rating}
                handleRatingChange={handleRatingChange}
                ratingCmpType={ratingCmpType}
              />
            </div>
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

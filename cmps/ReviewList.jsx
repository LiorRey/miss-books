import { ReviewPreview } from "./ReviewPreview.jsx"

export function ReviewList({ reviews, removeReview }) {
  if (!reviews || reviews.length === 0) return <h3>No reviews yet...</h3>
  return (
    <section className="review-list">
      {reviews.map(review => (
        <article key={review.id}>
          <ReviewPreview review={review} removeReview={removeReview} />
        </article>
      ))}
    </section>
  )
}

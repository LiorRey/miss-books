export function ReviewPreview({ review, removeReview }) {
  const { fullname, rating, readAt } = review

  return (
    <article className="review-preview">
      <div>
        <h3>Full Name: {fullname}</h3>
        <h3>Rating: {"⭐".repeat(rating)}</h3>
        <h3>Reat At: {readAt}</h3>
        <button onClick={() => removeReview(review.id)}>X</button>
      </div>
    </article>
  )
}

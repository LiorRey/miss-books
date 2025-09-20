export function RateByStars({ val, handleRatingChange }) {
  return (
    <section className="rate-by-stars">
      <div className="stars">
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            className={num <= val ? "star filled" : "star"}
            onClick={() => handleRatingChange(num)}
          >
            ★
          </span>
        ))}
      </div>
    </section>
  )
}

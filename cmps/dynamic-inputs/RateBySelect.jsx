export function RateBySelect({ val, handleRatingChange }) {
  return (
    <section className="rate-by-select">
      <select
        value={val}
        name="rating"
        onChange={ev => handleRatingChange(+ev.target.value)}
      >
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </section>
  )
}

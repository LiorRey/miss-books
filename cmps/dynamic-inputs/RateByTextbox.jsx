export function RateByTextbox({ val, handleRatingChange }) {
  return (
    <section className="rate-by-textbox">
      <input
        onChange={ev => handleRatingChange(+ev.target.value)}
        type="number"
        value={val}
        name="rating"
        min={1}
        max={5}
      />
    </section>
  )
}

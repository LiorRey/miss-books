export function BookPreview({ book }) {
  const { title, listPrice } = book
  const { amount, currencyCode, isOnSale } = listPrice
  return (
    <article className="book-preview">
      <h2>Title: {title}</h2>
      <h4>
        Price: {amount} {currencyCode}
      </h4>
      <h4>On Sale: {isOnSale}</h4>
      {/* <img src={imageSrc} title={title} alt={`Image of: ${title}`} /> */}
    </article>
  )
}

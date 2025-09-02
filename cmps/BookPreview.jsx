export function BookPreview({ book }) {
  const { title, listPrice, thumbnail } = book
  const { amount, currencyCode, isOnSale } = listPrice
  console.log(thumbnail)
  return (
    <article className="book-preview">
      <h2>Title: {title}</h2>
      <h4>
        Price: {amount} {currencyCode}
      </h4>
      <h4>{isOnSale && "On Sale!"}</h4>
      <div className="book-preview-image-container">
        <img src={thumbnail} title={title} alt={`Image of: ${title}`} />
      </div>
    </article>
  )
}

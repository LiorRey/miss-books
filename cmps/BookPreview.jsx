export function BookPreview({ book }) {
  const { title, description, listPrice, thumbnail } = book
  const { amount, currencyCode, isOnSale } = listPrice

  return (
    <article className="book-preview">
      <h2 className="preview-title">Title: {title}</h2>
      <h3 className="preview-description">
        Description:
        <br />
        {description}
      </h3>
      <h3 className="preview-price">
        Price: {amount} {currencyCode}
      </h3>
      <h2 className="preview-is-on-sale">{isOnSale && "On Sale!"}</h2>
      <div className="preview-image-container">
        <img src={thumbnail} title={title} alt={`Image of: ${title}`} />
      </div>
    </article>
  )
}

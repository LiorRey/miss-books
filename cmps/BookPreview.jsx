import { LongTxt } from "./LongTxt.jsx"
import { utilService } from "../services/util.service.js"

export function BookPreview({ book }) {
  const { title, description, listPrice, thumbnail } = book
  const { amount, currencyCode, isOnSale } = listPrice

  return (
    <article className="book-preview">
      <h2 className="preview-title">Title: {title}</h2>
      <LongTxt
        txt={description}
        length={100}
        classNameFromPreview="preview-description"
      />
      <h3
        className={`preview-price ${utilService.getStyleClassNameForAmountText(
          amount
        )}`}
      >
        Price: {amount} {currencyCode}
      </h3>
      {isOnSale && (
        <h2 className="preview-is-on-sale on-sale-animation">On Sale!</h2>
      )}
      <div className="preview-image-container">
        <img src={thumbnail} title={title} alt={`Image of: ${title}`} />
      </div>
    </article>
  )
}

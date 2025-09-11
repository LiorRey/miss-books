import { bookService } from "../services/book.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function BookEdit() {
  const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook())
  const navigate = useNavigate()
  const { bookId } = useParams()

  useEffect(() => {
    if (bookId) loadBook()
  }, [])

  function loadBook() {
    bookService
      .get(bookId)
      .then(setBookToEdit)
      .catch(err => console.log("Error while loading a book:", err))
  }

  function onSaveBook(ev) {
    ev.preventDefault()

    let bookToSave = bookToEdit

    // If we’re adding (no id yet) → fill missing fields
    if (!bookId) {
      const newBookRemainingFields =
        bookService.fillRemainingEmptyFieldsOfNewBook(bookToEdit)
      bookToSave = { ...bookToEdit, ...newBookRemainingFields }
    }

    bookService
      .save(bookToSave)
      .then(savedBook => {
        console.log("savedBook:", savedBook)
        showSuccessMsg("Book saved successfully!")
        navigate("/book")
      })
      .catch(err => {
        console.log("Error while saving a book:", err)
        showErrorMsg("Error while saving a book")
      })
  }

  function handleChange({ target }) {
    let { value, name: field } = target

    switch (target.type) {
      case "range":
      case "number":
        value = value === "" ? 0 : +target.value
        break
      case "checkbox":
        value = target.checked
        break
    }

    // Handle nested fields (dot notation)
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setBookToEdit(prevBook => ({
        ...prevBook,
        [parent]: { ...prevBook[parent], [child]: value },
      }))
    } else {
      setBookToEdit(prevBook => ({ ...prevBook, [field]: value }))
    }
  }

  const {
    title,
    subtitle,
    authors,
    publishedDate,
    description,
    pageCount,
    categories,
    listPrice,
    language,
  } = bookToEdit
  const { amount, currencyCode, isOnSale } = listPrice

  return (
    <section className="book-edit">
      <h1>{bookId ? "Edit" : "Add"} Book</h1>
      <form onSubmit={onSaveBook}>
        <div>
          <label htmlFor="title">
            <h3>Title:</h3>
          </label>
          <input
            onChange={handleChange}
            type="text"
            value={title}
            name="title"
            id="title"
          />
        </div>

        <div>
          <label htmlFor="subtitle">
            <h3>Subtitle:</h3>
          </label>
          <input
            onChange={handleChange}
            type="text"
            value={subtitle}
            name="subtitle"
            id="subtitle"
          />
        </div>

        <div>
          <label htmlFor="authors">
            <h3>Authors (comma-separated):</h3>
          </label>
          <input
            onChange={ev =>
              setBookToEdit(prevBook => ({
                ...prevBook,
                authors: ev.target.value.split(",").map(a => a.trimStart()),
              }))
            }
            type="text"
            value={authors.join(", ")}
            name="authors"
            id="authors"
          />
        </div>

        <div>
          <label htmlFor="publishYear">
            <h3>Publish Year:</h3>
          </label>
          <input
            onChange={handleChange}
            type="number"
            value={publishedDate === 0 ? 0 : String(Number(publishedDate))}
            name="publishedDate"
            id="publishYear"
            min={0}
            max={new Date().getFullYear()}
          />
        </div>

        <div>
          <label htmlFor="description">
            <h3>Description:</h3>
          </label>
          <input
            onChange={handleChange}
            type="text"
            value={description}
            name="description"
            id="description"
          />
        </div>

        <div>
          <label htmlFor="pageCount">
            <h3>Page Count:</h3>
          </label>
          <input
            onChange={handleChange}
            type="number"
            value={pageCount === 0 ? 0 : String(Number(pageCount))}
            name="pageCount"
            id="pageCount"
            min={0}
          />
        </div>

        <div>
          <label htmlFor="categories">
            <h3>Categories (comma-separated):</h3>
          </label>
          <input
            onChange={ev =>
              setBookToEdit(prevBook => ({
                ...prevBook,
                categories: ev.target.value.split(",").map(a => a.trimStart()),
              }))
            }
            type="text"
            value={categories.join(", ")}
            name="categories"
            id="categories"
          />
        </div>

        <div>
          <label htmlFor="price">
            <h3>Price (in EUR):</h3>
          </label>
          <input
            onChange={handleChange}
            type="number"
            value={amount === 0 ? 0 : String(Number(amount))}
            name="listPrice.amount"
            id="price"
            min={0}
          />
        </div>

        <div>
          <label htmlFor="on-sale">
            <h3>On Sale?</h3>
          </label>
          <input
            onChange={handleChange}
            type="checkbox"
            checked={isOnSale}
            name="listPrice.isOnSale"
            id="on-sale"
          />
        </div>

        <section>
          <button>Save</button>
        </section>
      </form>
    </section>
  )
}

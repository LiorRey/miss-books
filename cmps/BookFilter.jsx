import { bookService } from "../services/book.service.js"

const { useState, useEffect } = React

export function BookFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    let { value, name: field } = target

    switch (target.type) {
      case "range":
      case "number":
        value = +target.value
        break
      case "checkbox":
        value = target.checked
        break
    }

    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function onClearFilters(ev) {
    ev.preventDefault()

    const defaultFilter = bookService.getDefaultFilter()
    setFilterByToEdit(defaultFilter)
    onSetFilterBy(defaultFilter)
  }

  const { title, description, maxPrice, onlyOnSale } = filterByToEdit
  return (
    <section className="book-filter">
      <h2>Filter Our Books</h2>
      <form onSubmit={onClearFilters}>
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
          <label htmlFor="max-price">
            <h3>Max Price:</h3>
          </label>
          <input
            onChange={handleChange}
            type="number"
            value={maxPrice || ""}
            name="maxPrice"
            id="max-price"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="on-sale">
            <h3>Only On Sale?</h3>
          </label>
          <input
            onChange={handleChange}
            type="checkbox"
            checked={onlyOnSale}
            name="onlyOnSale"
            id="on-sale"
          />
        </div>

        <button>Clear Filters</button>
      </form>
    </section>
  )
}

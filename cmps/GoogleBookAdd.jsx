import { bookService } from "../services/book.service.js"
import { SearchGoogleBooksList } from "./SearchGoogleBooksList.jsx"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"

const { useState, useRef } = React
const { useNavigate } = ReactRouterDOM

export function GoogleBookAdd() {
  const [searchText, setSearchText] = useState("")
  const [googleBooksList, setGoogleBooksList] = useState()
  const navigate = useNavigate()
  const handleSearchDebounce = useRef(
    utilService.debounce(handleSearch, 1000)
  ).current

  function onSearchInputTextChange({ target }) {
    setSearchText(target.value)
    handleSearchDebounce(target)
  }

  function onResetClick() {
    setSearchText("")
    setGoogleBooksList([])
  }

  function handleSearch(target) {
    if (!target.value) {
      setGoogleBooksList([])
      return
    }

    bookService
      .getGoogleBooks(target.value)
      .then(googleBooks => setGoogleBooksList(googleBooks))
  }

  function onAddGoogleBook(googleBookToAdd) {
    bookService
      .addGoogleBook(googleBookToAdd)
      .then(addedGoogleBook => {
        console.log("Google Book Added:", addedGoogleBook)
        showSuccessMsg("Google book added successfully!")
      })
      .catch(err => {
        console.log("Error while adding a Google book:", err)
        showErrorMsg(
          err === "Book already saved"
            ? err
            : "Error while adding a Google book"
        )
      })
      .finally(() => navigate("/book"))
  }

  return (
    <section className="google-book-add">
      <h2>By Google Books Search</h2>
      <div>
        <label htmlFor="google-search-text-input">
          <h3>Search:</h3>
        </label>
        <input
          onChange={onSearchInputTextChange}
          type="text"
          value={searchText}
          name="googleSearchTextInput"
          id="google-search-text-input"
        />
        <button onClick={onResetClick}>Reset</button>
      </div>
      {googleBooksList && (
        <SearchGoogleBooksList
          googleBooksList={googleBooksList}
          onAddGoogleBook={onAddGoogleBook}
        />
      )}
    </section>
  )
}

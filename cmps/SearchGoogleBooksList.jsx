export function SearchGoogleBooksList({ googleBooksList, onAddGoogleBook }) {
  return (
    <ul className="search-google-books-list">
      {googleBooksList.map(googleBook => (
        <li key={googleBook.id}>
          <div>
            <button onClick={() => onAddGoogleBook(googleBook)}>+</button>
            <h4>{googleBook.title}</h4>
          </div>
        </li>
      ))}
    </ul>
  )
}

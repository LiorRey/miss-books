const { useNavigate } = ReactRouterDOM

export function NotFound() {
  const navigate = useNavigate()

  function onToBooksClick() {
    navigate("/book")
  }

  return (
    <section className="not-found">
      <section>
        <h1>Ooops... Error 404</h1>
      </section>
      <h3>Sorry but the page you are looking for does not exist.</h3>
      <button onClick={onToBooksClick}>To Books</button>
    </section>
  )
}

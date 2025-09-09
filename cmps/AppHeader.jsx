const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {
  return (
    <header className="app-header full main-layout">
      <section className="header-container">
        {/* <h1>React Starter Proj</h1> */}
        <h1>Miss Books - Part 2</h1>
        <nav className="app-nav">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/book">Books</NavLink>
        </nav>
      </section>
    </header>
  )
}

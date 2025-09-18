const { Link, Outlet } = ReactRouterDOM

export function AboutUs() {
  return (
    <section className="about-us">
      <h2>About Miss Books and us... 🤓</h2>
      <span>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis ut
        fugit id libero, doloremque exercitationem architecto, amet suscipit
        ratione consectetur nesciunt officiis aperiam iusto! Rem eius blanditiis
        itaque. Nihil, natus?
      </span>
      <nav>
        <Link to="/about/team">
          <i>Team</i>
        </Link>
        <Link to="/about/goal">
          <i>Goal</i>
        </Link>
      </nav>
      <Outlet />
    </section>
  )
}

import { AppHeader } from "./cmps/AppHeader.jsx"
import { HomePage } from "./cmps/HomePage.jsx"
import { AboutUs } from "./cmps/AboutUs.jsx"

const Router = ReactRouterDOM.HashRouter
const { Routes, Route, Navigate } = ReactRouterDOM

export function RootCmp() {
  return (
    <Router>
      <section className="app main-layout">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            {/* <Route path="/book" element={<BookIndex />} /> */}
            {/* <Route path="/book/:bookId" element={<BookDetails />} /> */}
            {/* <Route path="/book/edit" element={<BookEdit />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </section>
    </Router>
  )
}

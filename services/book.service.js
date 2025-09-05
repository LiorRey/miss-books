import { utilService } from "./util.service.js"
import { storageService } from "./async-storage.service.js"

const BOOK_KEY = "bookDB"
_createBooks()

export const bookService = {
  query,
  get,
  remove,
  save,
  getEmptyBook,
  getDefaultFilter,
  getTypeReadingLabelForBook,
  getSeniorityLabelForBook,
  getStyleClassNameForAmountText,
}

// For Debug (easy access from console):
// window.cs = bookService

function query(filterBy = {}) {
  return storageService.query(BOOK_KEY).then(books => {
    if (filterBy.title) {
      const regExp = new RegExp(filterBy.title, "i")
      books = books.filter(book => regExp.test(book.title))
    }

    if (filterBy.description) {
      const regExp = new RegExp(filterBy.description, "i")
      books = books.filter(book => regExp.test(book.description))
    }

    if (filterBy.maxPrice) {
      books = books.filter(book => book.listPrice.amount <= filterBy.maxPrice)
    }

    if (filterBy.onSale) {
      books = books.filter(book => book.listPrice.isOnSale === filterBy.onSale)
    }

    return books
  })
}

function get(bookId) {
  return storageService
    .get(BOOK_KEY, bookId)
    .then(book => _setNextPrevBookId(book))
}

function remove(bookId) {
  return storageService.remove(BOOK_KEY, bookId)
}

function save(book) {
  if (book.id) {
    return storageService.put(BOOK_KEY, book)
  } else {
    return storageService.post(BOOK_KEY, book)
  }
}

function getEmptyBook(
  title = "",
  subtitle = "",
  authors = [],
  publishedDate = -1,
  description = "",
  pageCount = 0,
  categories = [],
  thumbnail = "",
  language = "",
  listPrice = { amount: 0, currencyCode: "", isOnSale: false }
) {
  return {
    title,
    subtitle,
    authors,
    publishedDate,
    description,
    pageCount,
    categories,
    thumbnail,
    language,
    listPrice,
  }
}

function getDefaultFilter(
  filterBy = { title: "", description: "", maxPrice: 0, onSale: false }
) {
  return {
    title: filterBy.title,
    description: filterBy.description,
    maxPrice: filterBy.maxPrice,
    onSale: filterBy.onSale,
  }
}

function _setNextPrevBookId(book) {
  return query().then(books => {
    const bookIdx = books.findIndex(currBook => currBook.id === book.id)
    const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0]
    const prevBook = books[bookIdx - 1]
      ? books[bookIdx - 1]
      : books[books.length - 1]

    book.nextBookId = nextBook.id
    book.prevBookId = prevBook.id

    return book
  })
}

function _createBooks() {
  let books = utilService.loadFromStorage(BOOK_KEY)

  if (!books || !books.length) {
    const ctgs = ["Love", "Fiction", "Poetry", "Computers", "Religion"]
    books = []
    for (let i = 0; i < 20; i++) {
      const book = {
        id: utilService.makeId(),
        title: utilService.makeLorem(2),
        subtitle: utilService.makeLorem(4),
        authors: [utilService.makeLorem(1)],
        publishedDate: utilService.getRandomIntInclusive(1950, 2024),
        description: utilService.makeLorem(20),
        pageCount: utilService.getRandomIntInclusive(20, 600),
        categories: [
          ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)],
        ],
        // thumbnail: `http://coding-academy.org/books-photos/${i + 1}.jpg`,
        thumbnail: `assets/img/books-imgs/${i + 1}.jpg`,
        language: "en",
        listPrice: {
          amount: utilService.getRandomIntInclusive(80, 500),
          currencyCode: "EUR",
          isOnSale: Math.random() > 0.7,
        },
      }
      books.push(book)
    }

    utilService.saveToStorage(BOOK_KEY, books)
  }

  // console.log("books", books)
}

// function _createBook(vendor, maxSpeed = 250) {
//   const book = getEmptyBook(vendor, maxSpeed)
//   book.id = utilService.makeId()
//   return book
// }

function getTypeReadingLabelForBook(pageCount) {
  if (pageCount > 500) return " (Serious Reading)"
  if (pageCount > 200) return " (Descent Reading)"
  if (pageCount < 100) return " (Light Reading)"
  return ""
}

function getSeniorityLabelForBook(publishedDate) {
  const currentYear = new Date().getFullYear()
  const yearsSincePublish = currentYear - publishedDate
  if (yearsSincePublish > 10) return " (Vintage)"
  if (yearsSincePublish < 1) return " (New)"
  return ""
}

function getStyleClassNameForAmountText(amount) {
  if (amount > 150) return "amount-red"
  if (amount < 20) return "amount-green"
  return ""
}

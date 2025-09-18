import { utilService } from "./util.service.js"
import { storageService } from "./async-storage.service.js"

const BOOK_KEY = "bookDB"
const CACHE_STORAGE_KEY = "googleBooksCache"
const gCache = utilService.loadFromStorage(CACHE_STORAGE_KEY) || {}
const ctgs = ["Love", "Fiction", "Poetry", "Computers", "Religion"]
_createBooks()

export const bookService = {
  query,
  get,
  remove,
  save,
  getEmptyBook,
  getDefaultFilter,
  fillRemainingEmptyFieldsOfNewBook,
  addReview,
  removeReview,
  getGoogleBooks,
  addGoogleBook,
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
  publishedDate = 0,
  description = "",
  pageCount = 0,
  categories = [],
  thumbnail = "",
  language = "en",
  listPrice = { amount: 0, currencyCode: "EUR", isOnSale: false },
  reviews = []
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
    reviews,
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
        reviews: [],
      }
      books.push(book)
    }

    utilService.saveToStorage(BOOK_KEY, books)
  }
}

function fillRemainingEmptyFieldsOfNewBook(newBook) {
  let newBookRemainingFields = {}
  if (newBook) {
    const {
      title,
      subtitle,
      authors,
      publishedDate,
      description,
      pageCount,
      categories,
      listPrice,
    } = newBook
    const { amount, currencyCode, isOnSale } = listPrice

    newBookRemainingFields.title =
      title.trim() !== "" ? title : utilService.makeLorem(2)

    newBookRemainingFields.subtitle =
      subtitle.trim() !== "" ? subtitle : utilService.makeLorem(4)

    newBookRemainingFields.authors =
      authors.length > 0 ? authors : [utilService.makeLorem(1)]

    newBookRemainingFields.publishedDate =
      publishedDate >= 1950 && publishedDate <= new Date().getFullYear()
        ? publishedDate
        : utilService.getRandomIntInclusive(1950, 2024)

    newBookRemainingFields.description =
      description.trim() !== "" ? description : utilService.makeLorem(20)

    newBookRemainingFields.pageCount =
      pageCount > 0 ? pageCount : utilService.getRandomIntInclusive(20, 600)

    newBookRemainingFields.categories =
      categories.length > 0
        ? categories
        : [ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)]]

    newBookRemainingFields.thumbnail = `assets/img/books-imgs/${utilService.getRandomIntInclusive(
      1,
      20
    )}.jpg`

    newBookRemainingFields.listPrice = {
      amount: amount > 0 ? amount : utilService.getRandomIntInclusive(80, 500),
      currencyCode: currencyCode,
      isOnSale: isOnSale,
    }
  }

  return newBookRemainingFields
}

function addReview(bookId, review) {
  return storageService.get(BOOK_KEY, bookId).then(book => {
    if (!book.reviews) book.reviews = []

    review.id = utilService.makeId()
    book.reviews.unshift(review)

    return save(book)
  })
}

function removeReview(bookId, reviewId) {
  return storageService.get(BOOK_KEY, bookId).then(book => {
    if (!book.reviews) book.reviews = []

    book.reviews = book.reviews.filter(review => review.id !== reviewId)

    return save(book)
  })
}

function getGoogleBooks(bookName) {
  const googleBooks = gCache[bookName]
  if (googleBooks) {
    console.log("Cached data from storage:", googleBooks)
    return Promise.resolve(googleBooks)
  }

  const url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=${encodeURIComponent(
    bookName
  )}`
  return axios
    .get(url)
    .then(res => res.data.items)
    .then(_formatGoogleBooks)
    .then(books => {
      console.log("Fetched data from network:", books)
      gCache[bookName] = books
      utilService.saveToStorage(CACHE_STORAGE_KEY, gCache)

      return books
    })
}

function _formatGoogleBooks(googleBooks) {
  return googleBooks.map(googleBook => {
    const { volumeInfo } = googleBook
    const {
      title,
      subtitle,
      authors,
      publishedDate,
      description,
      pageCount,
      categories,
      imageLinks,
      language,
    } = volumeInfo

    const formattedGoogleBook = {
      id: googleBook.id,
      title: title || utilService.makeLorem(2),
      subtitle: subtitle || "",
      authors: authors || [utilService.makeLorem(1)],
      publishedDate:
        (publishedDate && Number(publishedDate.slice(0, 4))) ||
        utilService.getRandomIntInclusive(1950, 2024),
      description:
        (description && description.slice(0, 250)) || utilService.makeLorem(20),
      pageCount: pageCount || utilService.getRandomIntInclusive(20, 600),
      categories: categories || [
        ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)],
      ],
      thumbnail:
        (imageLinks && imageLinks.thumbnail) ||
        `assets/img/books-imgs/${utilService.getRandomIntInclusive(1, 20)}.jpg`,
      language: language || "en",
      listPrice: {
        amount: utilService.getRandomIntInclusive(80, 500),
        currencyCode: "EUR",
        isOnSale: Math.random() > 0.7,
      },
      reviews: [],
    }

    return formattedGoogleBook
  })
}

function addGoogleBook(googleBook) {
  return query().then(books => {
    const foundBook = books.find(book => book.id === googleBook.id)
    if (foundBook) return Promise.reject("Book already saved")
    return storageService.post(BOOK_KEY, googleBook)
  })
}

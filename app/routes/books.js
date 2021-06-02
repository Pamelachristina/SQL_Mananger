const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Handler function to wrap each route.*/
function asyncHandler(cb){
  return async(req, res, next) => {
    try{
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
      next(error);
    }
  }
}

/* GET / Home route should redirect to the /books route */
router.get('/', asyncHandler(async (req, res, next) => {
  res.redirect('/books');
})); 

/* GET / books Shows the full list of books */
router.get('/books', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render('index', { books: books })
}));

/* EDIT update form */
router.get('/books/update/:id', asyncHandler(async(req, res) => {
  const books = await Book.findByPk(req.params.id);
  if(book){
    res.render("update-book", { books, title: "Update Book" });
  } else {
    res.sendStatus(404);
  }
  
}));

/* Create a new book form. */
router.get('/books/new', (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});


/* POST create book. */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect(`/books`);   
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      //non-persistent model instance, will get saved automatically by create once form is valid
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" });
    } else {
      //catch all other errors in asyncHandler's catch block
      throw error;
    }
  }
}));

/* GET individual book. */
router.get("/books/:id", asyncHandler(async (req, res, next) => {

  const book = await Book.findByPk(req.params.id);
  console.log(book);
  //catch incorrect book.id request
  console.log(res.status);
  if(book){
    res.render("update-book", { book });
  } else {
    const error = new Error();
    error.status = 404
    error.message = ('abcdefg');
    throw error 
    
  }
}));

/* Update a book. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book = await Book.findByPk(req.params.id);
  if(book) {
    await book.update(req.body);
    res.redirect("/books/"); 
  } else {
    res.sendStatus(404);
  }
}));


// /* DELETE book form. */
// router.get('books/delete/:id', asyncHandler(async (req, res) => {
//   const books = await Book.findByPk(req.params.id);
//   res.render("update-book", { book: {}, title: "New Book" });
// }));

// /* DELETE book form. */
// router.post('/:id/delete', asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//  if(book) {
//    res.render('books', { book, title: 'Delete Book'});
//  } else{
//    res.sendStatus(404);
//  }
  
// }));


/* DELETE individual book. */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }

}));



module.exports = router;

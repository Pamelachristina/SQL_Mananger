const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Sequelize = require('sequelize');

const index = require('./routes/index');
const books = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', books);
//app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 error handler called')

  res.status(404).render('page-not-found')
    
  }); 

// global error handler
app.use(function(err, req, res, next) {
  console.log('global');
  res.locals.error = err

  if(err.status === 404 ){
    res.status(404).render('page-not-found', { err });
    /* console.log(err.message);
    res.status(err.status);
    return res.render('page-not-found'); */

  } else {
    err.message = err.message || 'Oops! looks like something went wrong on the server.';
    res.status(err.status || 500).render('error', { err });
  }
 
  
});

//test db connection
const sequelize = new Sequelize ({
  dialect: 'sqlite',
  storage: 'library.db'
});

// async IIFE
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the datatbase: ', error);

  }

  await sequelize.sync({ force: true });
  console.log('All models were synchronized successfully.');

})();




module.exports = app;
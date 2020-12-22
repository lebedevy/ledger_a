const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const expensesRouter = require('./routes/expenses');
const expensesRouterV2 = require('./routes/expensesV2');
const { graphqlHTTP } = require('express-graphql');
const { root, schema } = require('./routes/graphql');

const checkAuth = require('./middleware/auth');

const ENV = process.env.NODE_ENV || 'development';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/', indexRouter);
app.use('/api/users/expenses', expensesRouter);
app.use('/api/users/expensesV2', expensesRouterV2);
app.use('/api/users', usersRouter);
app.use(checkAuth);
app.use('/api/graphql', graphqlHTTP({ rootValue: root, schema, graphiql: ENV === 'development' }));

app.use('/', express.static(path.join(__dirname, '../client/build')));
app.use('*', express.static(path.join(__dirname, '../client/build')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

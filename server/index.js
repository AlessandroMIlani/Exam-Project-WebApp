'use strict';

const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const { check, validationResult, oneOf } = require('express-validator'); // validation middleware
const cors = require('cors');

const seatService = require('./services/order-service.js');
const concertService = require('./services/concert-service.js');
const userService = require('./services/user-service.js');

/*** init express and set-up the middlewares ***/
const app = express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));

/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

passport.use(new LocalStrategy(async function verify(email, password, callback) {
  console.log('LocalStrategy, user: ', email, password);
  const user = await userService.getUser(email, password)
  if (!user)
    return callback(null, false, 'Incorrect username or password');

  return callback(null, user); // NOTE: user info in the session (all fields returned by userService.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userService.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "I'm honest, I haven't copy this piece from the lab's code... Absolutely not /s",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: app.get('env') === 'production' ? true : false },
}));


app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

/*** Utility Functions ***/


// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


// ----------------- Concerts API -----------------

app.get('/api/concerts', async (req, res) => {
  concertService.getConcerts()
    .then((concerts) => res.json(concerts))
    .catch((err) => res.status(err.code).json(err.message));
});

app.get('/api/concerts/:id', async (req, res) => {
  concertService.getConcertById(req.params.id)
    .then((concert) => res.json(concert))
    .catch((err) => res.status(err.code).json(err.message));
});


app.get('/api/concerts/:id/booked', async (req, res) => {
  seatService.getBookedSeats(req.params.id)
    .then((seats) => res.json(seats))
    .catch((err) => res.status(err.code).json(err.message));
});


app.post('/api/concerts/:id/book', isLoggedIn, [
  check('seats').isArray({ min: 1 }),
  check('id').isInt({ min: 1 }),
],
  async (req, res) => {
    seatService.checkSeats(req.body.concertId, req.body.seats)
      .then((result) => {
        if (result.length === 0) {
          seatService.bookSeats(req.user.id, req.body.concertId, req.body.seats)
            .then((seats) => res.json(seats))
            .catch((err) => res.status(err.code).json(err.message));
        } else {
            res.status(400).json({ message: `Seats ${result} are already booked`, seats: result });
        }
      })
      .catch((err) => res.status(400).json(err.message));
  });

app.get('/api/user/booked', isLoggedIn, async (req, res) => {
  seatService.bookedByUser(req.user.id)
    .then((seats) => res.json(seats))
    .catch((err) => res.status(err.code).json(err.message));
});

app.delete('/api/user/booked/:id', isLoggedIn,
  [check('id').isInt({ min: 1 })],
  async (req, res) => {
  seatService.deleteBookedSeat(req.params.id, req.user.id)
    .then(() => res.json({ message: 'booking deleted' }))
    .catch((err) => res.status(err.code).json(err.message));
});


// ----------------- Users API -----------------

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userService.getUser() in LocalStratecy Verify Fn
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  console.log('GET /api/sessions/current, user: ', req.user);
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});




// ----------------- Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

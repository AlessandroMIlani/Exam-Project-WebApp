'use strict';

const express = require('express');
const morgan = require('morgan');   // logging middleware
const { body, check } = require('express-validator'); // validation middleware
const cors = require('cors');

const jsonwebtoken = require('jsonwebtoken');
// For better security, store the secret in an environment variable and not directly in the code
const jwtSecret = 'VGhpcyBpcyBhIGxvb29vb29uZyBzdHJpbmcgdGhhdCBpIGVuY29kZWQgaW4gQkFTRTY0IGZvciBnZXQgc29tZXRpbmcgdG8gdXNlIGFzIGEgc2VjcmV0IGtleQ==';
const expireTime = 600; // seconds

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

// ----------------- Passport.js -----------------

/** Authentication-related imports **/
const passport = require('passport');   // authentication middleware
const LocalStrategy = require('passport-local');  // authentication strategy (email and password)

passport.use(new LocalStrategy({ usernameField: "email", passowrdField: "password" }, async function checkPassword(email, password, callback) {
  return userService.checkPassword(email, password).then(user => {
    if (!user) { return callback(null, false); }
    return callback(null, user)
  }).catch(err => { return callback(err, false) });
}));

// Serializing and deserializing the user
passport.serializeUser(function (user, callback) { callback(null, user); });
passport.deserializeUser(function (user, callback) { return callback(null, user); });

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "I'm honest, I haven't copy this piece from the lab's code... Absolutely not /s",
  resave: false, saveUninitialized: false,
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


// ----------------- Concerts API -----------------


// GET /api/concerts
// This route is used for getting all general information about concerts.
app.get('/api/concerts', async (req, res) => {
  concertService.getConcerts()
    .then((concerts) => res.status(200).json(concerts))
    .catch((err) => res.status(err.code).json({message: err.message}));
});

// GET /api/concerts/:id
// This route is used for getting all the information about a concert by its id.
app.get('/api/concerts/:id',
  check('id').isInt({ min: 1 }),
  async (req, res) => {
    concertService.getConcertById(req.params.id)
      .then((concert) => res.status(200).json(concert))
      .catch((err) => res.status(err.code).json({message: err.message}));
  });

 
// ----------------- Seats API -----------------


// GET /api/concerts/:id/booked
// This route is used for getting alle the booked seats for a concert.
app.get('/api/concerts/:id/booked',
  check('id').isInt({ min: 1 }),
  async (req, res) => {
    seatService.getBookedSeats(req.params.id)
      .then((seats) => res.json(seats))
      .catch((err) => res.status(err.code).json({message: err.message}));
  });

// POST /api/concerts/:id/book
// This route is used for booking seats for a concert.
app.post('/api/concerts/:id/book', isLoggedIn, [
  check('id').isInt({ min: 1 }),
  body('seats').isArray({ min: 1 }),
  body('seats.*').isInt({ min: 1 }),
],
  async (req, res) => {
    seatService.checkSeats(req.params.id, req.body.seats)
      .then((result) => {
        console.log("prima quary passata");
        if (result.length === 0) {
          seatService.bookSeats(req.user.id, req.params.id, req.body.seats)
            .then((BookID) => res.status(200).json({ message: 'booking confirmed', id: BookID.id }))
            .catch((err) => res.status(err.code).json(err.message));
        } else {
          res.status(400).json({ message: `Seats ${result} are already booked`, seats: result });
        }
      })
      .catch((err) => res.status(400).json({message: err.message}));
  });

// GET /api/user/booked
// This route is used for getting the seats booked by the user.
app.get('/api/user/booked', isLoggedIn, async (req, res) => {
  seatService.bookedByUser(req.user.id)
    .then((seats) => res.status(200).json(seats))
    .catch((err) => res.status(err.code).json({message: err.message}));
});

// DELETE /api/user/booked/:id
// This route is used for deleting a reservetion.
app.delete('/api/user/booked/:id', isLoggedIn,
  [check('id').isInt({ min: 1 })],
  async (req, res) => {
    seatService.deleteBookedSeat(req.params.id, req.user.id)
      .then(() => res.status(200).json({ message: 'booking deleted' }))
      .catch((err) => res.status(err.code).json({message: err.message}));
  });


// ----------------- Users API -----------------


// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/logout', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

// POST /api/login
// This route is used for logging in the user.
app.post('/api/login', [
  check('email').isEmail(),
], function (req, res, next) {
  return passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(err.code).json({ message: err.message });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(req.user);
    });
  })(req, res, next);
});


// ----------------- Auth Token API -----------------

// GET /api/auth-token
// This route is used for getting the JWT token.
app.get('/api/auth-token', isLoggedIn, (req, res) => {
  let authLevel = req.user.isLoyal;
  const payloadToSign = { access: authLevel, authId: 1234 };
  const jwtToken = jsonwebtoken.sign(payloadToSign, jwtSecret, { expiresIn: expireTime });
  res.status(200).json({ token: jwtToken, authLevel: authLevel });
});


// ----------------- Activate the server

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


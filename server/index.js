'use strict';

const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const { body, check } = require('express-validator'); // validation middleware
const cors = require('cors');

const jsonwebtoken = require('jsonwebtoken');
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

/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

passport.use(new LocalStrategy( {usernameField: "email", passowrdField: "password"}, async function checkPassword(email, password, callback) {
  return userService.checkPassword(email, password).then(user => {
    if (!user) {
      return callback(null, false);
    }
    return callback(null, user)
  }).catch(err => { return callback(err, false) });
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

passport.deserializeUser(function (user, callback) { // this user is id + email + name 
   

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

app.get('/api/concerts/:id',
  check('id').isInt({ min: 1 }),
  async (req, res) => {
  concertService.getConcertById(req.params.id)
    .then((concert) => res.json(concert))
    .catch((err) => res.status(err.code).json(err.message));
});


app.get('/api/concerts/:id/booked',
  check('id').isInt({ min: 1 }),
   async (req, res) => {
  seatService.getBookedSeats(req.params.id)
    .then((seats) => res.json(seats))
    .catch((err) => res.status(err.code).json(err.message));
});


app.post('/api/concerts/:id/book', isLoggedIn, [
  check('id').isInt({ min: 1 }),
  body('seats').isArray({ min: 1 }),
  body('seats.*').isInt({ min: 1 }),
],
  async (req, res) => {
    seatService.checkSeats(req.params.id, req.body.seats)
      .then((result) => {
        if (result.length === 0 || result === true) {
          seatService.bookSeats(req.user.id, req.params.id, req.body.seats)
            .then((BookID) => res.status(200).json({message: 'booking confirmed', id: BookID.id}))
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


app.post('/api/login', function (req, res, next) {

  console.log('POST /api/login enter');

  return passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(err.code).json({ message: err.message });
    }


    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json(req.user);
    });
  })(req, res, next);

});



// ----------------- Auth Token API -----------------

// GET /api/auth-token
app.get('/api/auth-token', isLoggedIn, (req, res) => {
  let authLevel = req.user.isLoyal;
  
  const payloadToSign = { access: authLevel, authId: 1234 };
  const jwtToken = jsonwebtoken.sign(payloadToSign, jwtSecret, {expiresIn: expireTime});

  res.json({token: jwtToken, authLevel: authLevel});  // authLevel is just for debug. Anyway it is in the JWT payload
});




// ----------------- Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


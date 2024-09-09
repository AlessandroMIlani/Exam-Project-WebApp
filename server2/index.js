'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');

const { body, validationResult } = require("express-validator");

const { expressjwt: jwt } = require('express-jwt');
const jwtSecret = 'VGhpcyBpcyBhIGxvb29vb29uZyBzdHJpbmcgdGhhdCBpIGVuY29kZWQgaW4gQkFTRTY0IGZvciBnZXQgc29tZXRpbmcgdG8gdXNlIGFzIGEgc2VjcmV0IGtleQ==';


// init express
const app = express();
const port = 3002;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // To automatically decode incoming json

// Check token validity
app.use(jwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
})
);


// Error handling
app.use(function (err, req, res, next) {
  //console.log("DEBUG: error handling function executed");
  console.log(err);
  if (err.name === 'UnauthorizedError') {
    // Example of err content:  {"code":"invalid_token","status":401,"name":"UnauthorizedError","inner":{"name":"TokenExpiredError","message":"jwt expired","expiredAt":"2024-05-23T19:23:58.000Z"}}
    res.status(401).json({ errors: [{ 'param': 'Server', 'msg': 'Authorization error', 'path': err.code }] });
  } else {
    next();
  }
});


// ----------------- API -----------------

// GET /api/discount
// calculates a discount based on the seats provided
app.post('/api/discount',
  body('seats', "Seats must be an array").isArray(),
  (req, res) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(400).json({ errors: errList });
    }
    //console.log("DEBUG: auth: ",req.auth);

    const loyalUser = req.auth.access;
    const seats = req.body.seats;
    let discount = 0;

    for (const seat of seats) {
      const seatNumber = parseInt(seat.split('-')[0]);
      discount += seatNumber;
    }
    if (loyalUser === 0) {
      discount /= 3;
    }
    discount += Math.random() * (20 - 5) + 5;
    discount = Math.round(discount);
    discount = Math.max(5, Math.min(50, discount));

    res.json({ discount: discount });
  });



// ----------------- Start Server -----------------

// Activate the server
app.listen(port, () => {
  console.log(`qa-server listening at http://localhost:${port}`);
});

'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('../db');
db.get('PRAGMA foreign_keys = ON');

const convertRowtoUser = (row) => {
  return {
    id: row.id,
    email: row.email,
    hash_pswd: row.hash_pswd,
    salt: row.salt,
    isLoyal: row.is_loyal
  };
};


// This function returns user's information given its id.
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.log("Error in UsersDAO - getUserById");
        reject({ code: 500, message: "Error in UsersDAO - getUserById" });
      }
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else { resolve(convertRowtoUser(row));
      }
    });
  });
};

// This function returns user's information given its email.
exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email=?';
    db.get(sql, [email], (err, row) => {
      if (row === undefined) {
        console.log("User not found");
        reject({ code: 401, message: "Incorrect email or password" });
      }
      else if (err) {
        console.log("Error in UsersDAO - getUserByEmail");
        reject(err);
      } else { resolve(convertRowtoUser(row)); }
    });
  });
};
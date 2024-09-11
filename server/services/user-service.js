"use strict";

const crypto = require('crypto');
const usersDao = require('../dao/users-dao.js');

exports.getUserById = (id) => {
    const promise = usersDao.getUserById(id);
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: err.msg };
    });
}

exports.getUserByEmail = (email) => {
    const promise = usersDao.getUserByEmail(email);
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: err.msg };
    });
}

exports.checkPassword = (email, password) => {
    const userPromise = this.getUserByEmail(email);
    return new Promise((resolve, reject) => {
        return userPromise.then(user => {
            crypto.scrypt(password, user.salt, 64, function (err, CalcPswd) {
                if (err) {
                    console.log("Error in crypto library");
                    reject({ code: 500, message: 'Generic Error' });
                }
                if (!crypto.timingSafeEqual(Buffer.from(user.hash_pswd, 'hex'), CalcPswd)) { // WARN: it is hash and not password (as in the week example) in the DB
                    console.log("Incorrect email or password");
                    reject({ code: 401, message: "Incorrect email or password " });
                }
                resolve(user);
            });
        }).catch(err => {
            console.log("Incorrect email or password");
            reject({ code: err.code, message: "Incorrect email or password" });
        });
    })
}

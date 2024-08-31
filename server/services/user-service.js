"use strict";

const usersDao = require('../dao/users-dao.js');

exports.getUserById = (id) => {
    const promise = usersDao.getUserById(id);
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: { message: err.msg } };
    });
}

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
    const promise = usersDao.getUser(email, password);
    promise.then(user => {
        console.log('Service: getUser, user: ', user);
        // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
        crypto.scrypt(password, user.salt, 64, function (err, CalcPswd) { // WARN: it is 64 and not 32 (as in the week example) in the DB
            if (err){ console.log("<aseiufhuisegfh:", err); reject(err); }
            if (!crypto.timingSafeEqual(Buffer.from(row.hash_pswd, 'hex'), CalcPswd)){ // WARN: it is hash and not password (as in the week example) in the DB
                console.log("Service: getUser, wrong password");
                resolve(false);
            }
            else
                resolve(user);
        });
    }).catch(err => {
        throw { code: err.code, message: { message: err.msg } };
    });
});
}

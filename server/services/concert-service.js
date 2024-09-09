"use strict";

const concertDao = require('../dao/concerts-dao');


exports.getConcerts = () => {
    const promise = concertDao.getConcerts();
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: { message: err.msg } };
    });
}

exports.getConcertById = (id) => {
    const promise = concertDao.getConcertById(id);
    return promise.then(res => {
        return res;
    }).catch(err => {
        console.log("Error in getConcertById + ", err);
        throw { code: err.code, message:  err.msg };
    });
}

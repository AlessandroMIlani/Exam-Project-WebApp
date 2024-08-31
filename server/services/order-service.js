"use strict";

const seatDao = require('../dao/orders-dao');
const dayjs = require("dayjs");

exports.getBookedSeats = (concertId) => {
    const promise = seatDao.getBookedSeats(concertId);
    return promise.then(res => {
        // result 
        const result = {
            concertId: concertId,
            seats: []
        };
        res.forEach(item => {
            item.seats.forEach(i => {
                result.seats.push(i);
            });
        });
        return result;
    }).catch(err => {
        throw { code: err.code, message: { message: err.msg} };
    });
};

exports.checkSeats = (concertId, seat_ids) => {
    const promise = seatDao.getBookedSeats(concertId);
    return promise.then(res => {
        if (res.length === 0) {
            return true;
        }
        const booked = []
        res.forEach(item => {
            item.seats.forEach(i => {
                booked.push(i);
            });
        });
        const alredyBooked = seat_ids.filter(r => booked.includes(r));
        return alredyBooked;
    }).catch(err => {
        throw { code: err.code, message: { msg: err.message  } };
    });

};


exports.bookedByUser = (userId) => {
    const promise = seatDao.getBookedByUser(userId);
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: { message: err.msg} };
    });
}

exports.bookSeats = (userId, concertId, seat_ids) => {
    // tranform array seat_ids in to {"id":[ 10,11,12]}
    const seat_ids_json = '{"id":[' + seat_ids.join(",") + ']}';
    console.log(seat_ids_json);
    const promise = seatDao.bookSeats(userId, concertId, seat_ids_json);
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: { message: err.msg} };
    });
}

exports.deleteBookedSeat = (id, userId) => {
    return new Promise((resolve, reject) => {
        const checkDel = seatDao.checkIsNotDeleted(id, userId);
        checkDel.then(res => {
            if (!res) {
                reject({ code: 400, message: { message: "Booking already deleted" } });
            } else {
                const promise = seatDao.deleteBookedSeat(id, userId, dayjs().format("YYYY-MM-DD HH:mm"));
                promise.then(res => {
                    resolve(res);
                }).catch(err => {
                    reject({ code: err.code, message: { message: err.msg} });
                });
            }
        }).catch(err => {
            reject({ code: err.code, message: { message: err.msg} });
        });
    });
}
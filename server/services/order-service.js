"use strict";

const ordersDao = require('../dao/orders-dao');
const dayjs = require("dayjs");

exports.getBookedSeats = (concertId) => {
    const promise = ordersDao.getBookedSeats(concertId);
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
        throw { code: err.code, message: err.msg };
    });
};

exports.checkSeats = (concertId, seat_ids) => {
    const promise = ordersDao.getBookedSeats(concertId);
    return promise.then(res => {
        if (res.length === 0) {
            return [];
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
        console.log("Some error in promise: ", err);
        throw { code: err.code, message: err.msg };
    });

};


exports.bookedByUser = (userId) => {
    const promise = ordersDao.getBookedByUser(userId);
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: err.msg };
    });
}

exports.bookSeats = (userId, concertId, seat_ids) => {
    const seat_ids_json = JSON.stringify({ id: seat_ids });

    const promise = ordersDao.bookSeats(userId, concertId, seat_ids_json);
    return promise.then(res => {
        return res;
    }).catch(err => {
        throw { code: err.code, message: { message: err.msg } };
    });
}

exports.deleteBookedSeat = (id, userId) => {
    return new Promise((resolve, reject) => {
        const checkDel = ordersDao.checkIsNotDeleted(id, userId);
        checkDel.then(res => {
            if (!res) {
                reject({ code: 400, message: { message: "Booking already deleted" } });
            } else {
                const promise = ordersDao.deleteBookedSeat(id, userId, dayjs().format("YYYY-MM-DD HH:mm"));
                promise.then(res => {
                    resolve(res);
                }).catch(err => {
                    reject({ code: err.code, message: { message: err.msg } });
                });
            }
        }).catch(err => {
            reject({ code: err.code, message: { message: err.msg } });
        });
    });
}
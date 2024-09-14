"use strict";

const db = require('../db');
const dayjs = require("dayjs");
db.get('PRAGMA foreign_keys = ON');

const convertRowtoConcert = (dbRecord) => {
    return {
        id: dbRecord.id,
        concert_id: dbRecord.concert_id,
        user_id: dbRecord.user_id,
        seats: JSON.parse(dbRecord.seats).id,
    };
}

const convertSeatsWithConcert = (dbRecord) => {
    return {
        id: dbRecord.id,
        concert_id: dbRecord.concert_id,
        user_id: dbRecord.user_id,
        seats: (JSON.parse(dbRecord.seats)).id,
        concert_date: dayjs(dbRecord.concert_date).format("YYYY-MM-DD HH:mm"),
        concert_name: dbRecord.concert_name,
        columns: dbRecord.columns
    };
}

exports.getBookedSeats = (concertId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT orders.*
            FROM orders
            WHERE concert_id = ? AND deleted_at IS NULL
        `;
        db.all(query, [concertId], (err, rows) => {
            if (err) {console.log("Error in OrdersDAO - getBookedSeats"); reject({ code: 500, msg: "Error in the DB" });}
            const seats = rows.map((row) => {
                return convertRowtoConcert(row);
            });
            resolve(seats);
        });

    });
}

exports.getBookedByUser = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT orders.*, concerts.datetime AS concert_date, concerts.name AS concert_name, sizes.columns as columns
            FROM orders
            JOIN concerts ON orders.concert_id = concerts.id
            JOIN theaters ON concerts.theater_id = theaters.id
            JOIN sizes ON theaters.size_id = sizes.id
            WHERE user_id = ? AND deleted_at IS NULL
        `;
        db.all(query, [userId], (err, rows) => {
            if (err) {console.log("Error in OrdersDAO - getBookedByUser"); reject({ code: 500, msg: "Error in the DB" });}
            const seats = rows.map((row) => {
                return convertSeatsWithConcert(row);
            });
            resolve(seats);
        });

    });
}

// TODO: check if insert seat_ids in this way can lead to SQL injection
exports.bookSeats = (userId, concertId, seat_ids) => {
    console.log("userID: ", userId, "concertID: ", concertId);
    
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO orders (concert_id, user_id, seats)
            VALUES (?, ?, ?)
        `;
        db.run(query, [concertId, userId, seat_ids], function (err) {
            if (err) {console.log("Error in OrdersDAO - bookSeats"); reject({ code: 500, message: "Error in the DB" });}
            resolve({ id: this.lastID });
        });
    });
}

exports.deleteBookedSeat = (id, userId, time) => {
    return new Promise((resolve, reject) => {
        const query = `
         UPDATE orders
         SET deleted_at = ?
        WHERE id = ? AND user_id = ?
        `;
        db.run(query, [time, id, userId], function (err) {
            if (err) {console.log("Error in OrdersDAO - deleteBookedSeat"); reject({ code: 500, message:"Error in the DB" });}
            resolve({ id: this.lastID });
        });
    });
}

exports.checkIsNotDeleted = (id, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM orders
            WHERE id = ? AND user_id = ? AND deleted_at IS NULL
        `;
        db.get(query, [id, userId], (err, row) => {
            if (err) {console.log("Error in OrdersDAO - checkIsNotDeleted"); reject({ code: 500, message: "Error in the DB" });}
            if (row) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}
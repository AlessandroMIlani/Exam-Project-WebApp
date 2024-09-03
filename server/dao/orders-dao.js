"use strict";

const db = require('../db');
const dayjs = require("dayjs");

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
            if (err) { reject(err); }
            const seats = rows.map((row) => {
                return convertRowtoConcert(row);
            });
            resolve(seats);
        })/* .catch(err => {
            reject(err);
        }) */;

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
            if (err) { reject(err); }
            const seats = rows.map((row) => {
                return convertSeatsWithConcert(row);
            });
            resolve(seats);
        })/* .catch(err => {
            reject(err);
        }) */;

    });
}

// TODO: check if insert seat_ids in this way can lead to SQL injection
exports.bookSeats = (userId, concertId, seat_ids) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO orders (concert_id, user_id, seats)
            VALUES (?, ?, ?)
        `;
        db.run(query, [concertId, userId, seat_ids], function (err) {
            if (err) { reject(err); }
            resolve({ id: this.lastID });
        })/* .catch(err => {
            reject(err);
        }) */;
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
            if (err) {reject(err); }
            resolve({ id: this.lastID });
        })/* .catch(err => {
            reject(err);
        }) */;
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
            if (err) { reject(err); }
            if (row) {
                resolve(true);
            } else {
                resolve(false);
            }
        })/* .catch(err => {
            reject(err);
        }) */;
    });
}
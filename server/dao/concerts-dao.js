"use strict";

const db = require('../db');
const dayjs = require("dayjs");


const convertConcertFromDb = (dbRecord) => {
    return {
        id: dbRecord.id,
        name: dbRecord.name,
        datetime: dayjs(dbRecord.datetime).format('YYYY-MM-DD HH:mm:ss'),
        description: dbRecord.description,
        theater: dbRecord.theater_name
    };
}

const covertConcertFullDataFromDb = (dbRecord) => {
    return {
    id: dbRecord.id,
    name: dbRecord.name,
    date: dayjs(dbRecord.date).format('YYYY-MM-DD HH:mm:ss'),
    description: dbRecord.description,
    theater: dbRecord.theater_name,
    size: dbRecord.size,
    rows: dbRecord.rows,
    columns: dbRecord.columns,
    total_seat: dbRecord.total_seats,


    };
}

exports.getConcerts = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT concerts.*, theaters.name AS theater_name
            FROM concerts
            JOIN theaters ON concerts.theater_id = theaters.id
        `;
        db.all(query, [], (err, rows) => {
            if (err) { reject(err); }
            const concerts = rows.map((row) => {
                return convertConcertFromDb(row);
            });
            resolve(concerts);
        });
    });
};

exports.getConcertById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT concerts.*, theaters.name AS theater_name, sizes.rows AS rows, sizes.columns AS columns, sizes.total_seat AS total_seats
            FROM concerts
            JOIN theaters ON concerts.theater_id = theaters.id
            JOIN sizes ON theaters.size_id = sizes.id
            WHERE concerts.id = ?
        `;
        db.get(query, [id], (err, row) => {
            if (err) { reject(err); }
            if (row === undefined) {
                throw { code: 500, message: { message: "id not present in the db"} };
            }else {
                const concertCard = covertConcertFullDataFromDb(row);
                resolve(concertCard);
            }
        });
    });
}


exports.bookSeats = (book) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO orders (concert_id, user_id, seats)
            VALUES (?, ?, ?)
        `;
        db.run(query, [book.concertId, book.userId, book.seats], function(err) {
            if (err) { reject(err); }
            resolve(this.lastID);
        });
    });
}

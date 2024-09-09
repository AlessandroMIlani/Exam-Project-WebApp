"use strict";

const db = require('../db');
const dayjs = require("dayjs");
db.get('PRAGMA foreign_keys = ON');

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
            if (err) {console.log("Error in ConcertsDAO - getConcert"); reject({ code: 500, msg: "Error in ConcertsDAO - getConcert" });}
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
            if (err) {console.log("Error in ConcertsDAO - getConcertById + ", err); reject({ code: 500, msg: "Error in ConcertsDAO - getConcertById" });}
            if (row === undefined) {
                reject({ code: 500, msg:  "id not present in the db" });
            }else {
                const concertCard = covertConcertFullDataFromDb(row);
                resolve(concertCard);
            }
        });
    });
}
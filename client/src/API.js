import dayjs from 'dayjs';
import { json } from 'react-router-dom';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {
                    // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
                    response.json()
                        .then(json => resolve(json))
                        .catch(err => reject({ error: "Cannot parse server response" }))

                } else {
                    // analyzing the cause of error
                    response.json()
                        .then(obj =>
                            reject(obj)
                        ) // error msg in the response body
                        .catch(err => reject({ error: "Cannot parse server response" })) // something else
                }
            })
            .catch(err =>
                reject({ error: "Cannot communicate" })
            ) // connection error
    });
}


const getConcerts = async () => {
    return getJson(
     fetch(SERVER_URL + 'concerts', {
        method: 'GET'},
    )).then(json =>{ return json.map((concert) => {
        const clientConcert = {
            id: concert.id,
            name: concert.name,
            date: dayjs(concert.datetime).format('YYYY-MM-DD'),
            theater: concert.theater,
            description: concert.description
        };
        return clientConcert;
    })
});
}

const getConcertByID = async (id) => {
    return getJson(fetch(SERVER_URL + 'concerts/' + id, {
        method: 'GET'
    })).then(concert => {
        const clientConcert = {
            id: concert.id,
            name: concert.name,
            date: dayjs(concert.datetime).format('YYYY-MM-DD HH:mm'),
            theater: concert.theater,
            description: concert.description,
            rows: concert.rows,
            columns: concert.columns,
            total_seats: concert.total_seat
        };
        return clientConcert;
    });
}

const getBookedSeatsByID = async (id) => {
    return getJson(fetch(SERVER_URL + 'concerts/' + id + '/booked', {
        method: 'GET'
    })).then(seats => {
            const clientSeat = {
                id: seats.concertId,
                seats: seats.seats
            };
            return clientSeat;

    });
}

const bookSeats = async (concertId, seats) => {
    console.log('booking seats: ', seats);
    console.log('For concertId: ', concertId);
    return getJson(fetch(SERVER_URL + 'concerts/' + concertId + '/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({seats})
    }));
}

const getBookedSeatsByUser = async () => {
    return getJson(fetch(SERVER_URL + 'user/booked', {
        method: 'GET',
        credentials: 'include'
    })).then(seats => {
        return seats.map(seat => {
            const clientSeat = {
                id: seat.id,
                concert_id: seat.concert_id,
                user_id: seat.user_id,
                seats: seat.seats,
                concert_date: dayjs(seat.concert_date).format('YYYY-MM-DD HH:mm'),
                concert_name: seat.concert_name,
                columns: seat.columns
            };
            return clientSeat;
        });
    });
}

const deleteBookedSeat = async (id) => {
    return getJson(fetch(SERVER_URL + 'user/booked/' + id, {
        method: 'DELETE',
        credentials: 'include'
    }));
}

/**
 * This function wants email and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    return getJson(fetch(SERVER_URL + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(credentials),
    })
    )
  };

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
      // this parameter specifies that authentication cookie must be forwared
      credentials: 'include'
    })
    )
  };

const logout = async () => {
    return getJson(fetch(SERVER_URL + 'logout', {
        method: 'DELETE',
      // this parameter specifies that authentication cookie must be forwared
      credentials: 'include'
    })
    )
  };

const API = {getConcerts, getConcertByID, getBookedSeatsByID, getBookedSeatsByUser, bookSeats, deleteBookedSeat, getUserInfo, logIn, logout};
export default API;
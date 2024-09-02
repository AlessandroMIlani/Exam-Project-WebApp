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


/**
 * This function wants username and password inside a "credentials" object.
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

const API = {getConcerts, getUserInfo, logIn, logout};
export default API;
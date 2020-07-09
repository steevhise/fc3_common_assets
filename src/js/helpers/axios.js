import axios from 'axios'

export const API = axios.create({
  withCredentials: true
})

export const handleError = e => {
  console.error('Error on request to ' + [e.config.baseURL, e.config.url].join('/'), e);
}

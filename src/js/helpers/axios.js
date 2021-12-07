import axios from 'axios'

export const API = axios.create({
  withCredentials: true,
  validateStatus: null
})

export const handleError = e => {
  console.error(e);
}

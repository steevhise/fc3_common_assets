import axios from 'axios'

export const API = axios.create({
  withCredentials: true
})

export const handleError = e => {
  console.error(e);
}

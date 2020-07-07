import axios from 'axios'

export const hapiDomain = () => {
  switch (process.env.VUE_APP_ENVIRONMENT) {
    case 'production':
      return 'mt.freecycle.org'
    case 'staging':
      return 'modstaging.freecycle.org'
    case 'development':
      return 'mt.freecycle.org:8000'
    default:
      return 'modstaging.freecycle.org'
  }
}

export const API = axios.create({
  baseURL: 'https://' + hapiDomain(),
  withCredentials: true
})

export const handleError = e => {
  console.error('Error on request to ' + [e.config.baseURL, e.config.url].join('/'), e);
}

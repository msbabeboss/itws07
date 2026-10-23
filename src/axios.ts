import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/itws07-api' : 'http://localhost/itws07-api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export default api
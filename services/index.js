import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api/',
  headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json'
  }
})

export default api
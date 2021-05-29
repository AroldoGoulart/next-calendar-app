import axios from 'axios';
const api = axios.create({
  baseURL: 'https://195.238.80.190:5353/api/',
  headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json'
  },
})

export default api
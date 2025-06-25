import axios from 'axios';

console.log(import.meta.env.VITE_API_URL)

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


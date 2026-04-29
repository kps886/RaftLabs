import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_URL}/menu`;

export const fetchMenu = () => axios.get(BASE).then(r => r.data);
export const fetchMenuItem = (id) => axios.get(`${BASE}/${id}`).then(r => r.data);
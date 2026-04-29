import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_URL}/api/orders`;

export const placeOrder = (payload) => axios.post(BASE, payload).then(r => r.data);
export const fetchOrder = (id) => axios.get(`${BASE}/${id}`).then(r => r.data);
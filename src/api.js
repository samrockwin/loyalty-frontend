import axios from 'axios';

const API_URL = 'https://loyaltybackend.gt.tc';

const api = axios.create({
    baseURL: API_URL,
});

export default api;
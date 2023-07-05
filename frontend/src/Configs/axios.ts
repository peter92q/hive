import axios, { AxiosResponse } from 'axios';
import { store } from './Redux/store';

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config =>{
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    delete:(url: string) => axios.delete(url).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody)
}
  
const agent = {
    requests
}

export default agent;
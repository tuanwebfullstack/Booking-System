import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout:15000,
    withCredentials:true,
})

let accessToken = '';

export const setAccessToken = (token) =>{
    accessToken = token
}

export const getAccessToken = ()=>{
    return accessToken
}

api.interceptors.request.use((config)=>{
    const token  = getAccessToken();

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use((res)=>{
    (res) =>res,

    async (err) =>{
        const original = err.config;

        if(err.response?.status === 401 && !original._retry) {
            original._retry = true;

            const {data} = await api.post('/auth/refresh')

            setAccessToken(data.accessToken);

            original.headers.Authorization = `Bearer ${data.accessToken}`;

            return api(original)
        }

        return Promise.reject(err)
    }
})
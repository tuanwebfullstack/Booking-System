import {api, setAccessToken} from './axios';

export const  registerOwner = (payload) => api.post('/auth/registerOwner',payload).then((r)=> r.data.data);

export const login  = (payload) => {
    api.post('/auth/login',payload).then((r)=>{
       
        setAccessToken(r.data.data.accessToken);
        return r.data.data
        
    })
}

export const fetchMe = () => api.get('auth/getMe').then((r)=>r.data.data.user)

export const logout = () => api.post('/auth/logout');


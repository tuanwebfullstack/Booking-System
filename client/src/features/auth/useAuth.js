
import {setAccessToken} from '../../api/axios';
import { create } from 'axios';

export const  useAuth = create((set)=>({

    user:null,
    isAuthChecked:false,

    setUser: (user) =>set({user}),
    setIsAuthChecked:(v) => set({isAuthChecked:v}),
    logout: () =>{
        setAccessToken(null),
        set({user:null})
    }
}))

import env from '../../config/env.js'
import { User } from '../../models/user.model.js';
import {asyncHandler} from '../../utils/asyncHandler.js';
import * as authService from './auth.service.js';

const cookiesOpt = {
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure:env.nodeEnv ==='production',
    sameSite: 'Lax'
}

export const registerOwner = asyncHandler(async(req,res)=>{
    
    const {tenant,user} = await authService.registerOwner(req.body);

    res.status(201).json({
        success:true,
        data:{

            tenant:{
                id:tenant._id,
                name:tenant.name,
                slug:tenant.slug
            },
            user:{
                id:user._id,
                tenantId:user.tenantId,
                name:user.name,
                email:user.email,
                role:user.role
            }
        }  
    })
})

export const login = asyncHandler(async(req,res)=>{
    const {user,accessToken,refreshToken}= await authService.login(req.body);

    res.cookie('refreshToken',refreshToken,cookiesOpt);

    res.status(200).json({
        success:true,
        data:{
          user:{id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId 
        },
          accessToken
        }
    })
});

export const refresh = asyncHandler(async(req,res)=>{
    const {accessToken,refreshToken} = await authService.refresh(req.cookies.refreshToken);

    res.cookie('refreshToken',refreshToken,cookiesOpt);

    res.status(200).json({
        success:true,
        data:{
            accessToken
        }
    })
});

export const logout = asyncHandler(async(req,res)=>{

    let refreshToken = req.cookies.refreshToken;
    
    const user = await User.findOne({refreshToken});

    if(user) {
        user.refreshToken = '';
        await user.save();
    }
    res.clearCookie('refreshToken',cookiesOpt);
    res.status(200).json({
        success:true,
    })
});

export const getMe = asyncHandler(async(req,res)=>{

    res.status(200).json({
        success:true,
        data:{user:req.user}
    })
})
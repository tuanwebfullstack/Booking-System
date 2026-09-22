import User from '../../models/user.model';
import Tenant from '../../models/tenant.model';
import AppError from '../../utils/AppError';
import { signAccess,signRefresh,verifyRefresh,signRefresh} from '../../utils/jwt';
import env from '../../config/env'

export const registerOwner  = async ({ tenantName, slug, email, password, name }) =>{
    const existingTenant  = await Tenant.findOne({slug});

    if(existingTenant ) {
        throw new AppError('Slug đã tồn tại',409)
    }

    const tenant = await Tenant.create({name:tenantName,slug, status:'active'});

    const user = await User.create({
        tenantId: tenant._id,
        name,
        email,
        password,
        role:'owner',
    })

    return {tenant,user}
}

export const login =async ({email,password,tenantId}) =>{

    const existingUser = await User.findOne({email,tenantId}).select("+password");

    if(!existingUser) {
        throw new AppError('Email hoặc mật khẩu không đúng',401);
    }
    const valid  = await existingUser.validatePassword(password);

    if(!valid) {
        throw new AppError('Sai Email hoặc mật khẩu',401)
    }
    const payload = {
        userId:existingUser._id,
        tenantId:existingUser.tenantId,
        role:existingUser.role
    }

    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);
    existingUser.refreshToken=refreshToken;
    await existingUser.save();

    const {password:pwd,...responseData} = existingUser._doc;
    

    return {user:responseData,accessToken,refreshToken};

}

export const refresh =async(token) =>{

    if(!token) {
        throw new AppError('Refresh token không được cung cấp',401)
    }

    let decoded;

    try {
      decoded = verifyRefresh(token);
        
    } catch  {
       throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn',401)     
    }

    const user = await User.findById(decoded.userId).select("+refreshToken");

    if(!user || user.refreshToken !==token) {
        throw new AppError('Refresh token không khớp');
    }

    const payload = {userId:user._id,tenantId:user.tenantId,role:user.role}

    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)
    user.refreshToken = refreshToken

    await user.save()

    return  {accessToken,refreshToken}
}
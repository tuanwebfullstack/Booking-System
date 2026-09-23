import { verifyAccess } from '../utils/jwt.js';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async(req,res,next)=>{

    const token  = req.header('Authorization')?.replace('Bearer ','');

    if(!token) {
        throw new AppError('Không có token quyền truy cập bị từ chối',401)
    }
    let decoded 
    try {
        decoded = verifyAccess(token);
        
    } catch (error) {
        throw new AppError('Token không hợp lệ hoặc hết hạn',401)
    }

    const user = await User.findById(decoded.userId).select('_id tenantId email name role').lean();

    if(!user) {
        throw new AppError("User không tồn tại",401);
    }
    req.user = {
        id:user._id,
        tenantId:user.tenantId,
        email:user.email,
        role:user.role
    }
    next();

})

export const checkRole = (...allowedRoles) => (req,res,next)=>{
    if(!req.user) {
        throw new AppError('Chưa đăng nhập',401)
    }

    if(!allowedRoles.includes(req.user.role)) {
        throw new AppError('Không có quyền',403)
    }

    next();
}


import {AppErr} from '../utils/AppError'
import {asyncHandler} from '../utils/asyncHandler'
import Tenant from '../models/tenant.model'

export const requireTenant = (req,res,next) =>{
    if(!req.tenatId) {
       throw new AppErr('Thiếu tenant context',400)
    }
    next()
}

export const resolveTenant = asyncHandler(async(req,res,next)=>{

    let slug  = req.headers['x-tenant-slug'];

    if (!slug) {

        const host = req.hostname; 
        const parts = host.split('.');
        if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'app') {
            const candidate = parts[0];
            if (candidate !== env.rootDomain) slug = candidate;
        }
    }

    if (!slug) return next();

    const tenant = await Tenant.findOne({slug, status:'active'}).lean();

    if (!tenant) {
     throw new AppErr('Tenant không tồn tại hoặc bị khóa',404)
    }
    if(req.user.tenantId !== String(tenant._id)) {
       throw new AppErr('Tenant không đúng',404)
    }

    req.tenantId = tenant._id;
    req.tenant = tenant;

    next();
})
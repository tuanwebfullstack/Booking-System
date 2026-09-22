import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
    tenantId: {type:mongoose.Schema.Types.ObjectId,ref:"Tenant",default:null,index:true},
    name:{type:String,required:true,trim:true},
    password:{type:String,required:true,select:false},
    email:{type:String,required:true,trim:true},
    role:{type:String,enum:['owner','staff','admin','customer'],default:'customer'},
    phone:{type:String, default:''},
    refreshToken: { type: String, select: false },

},{
    timestamps:true
})

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);

        thid.password=hashedPassword
        next();
        
    } catch (error) {
        next(error)
    }
})

userSchema.method('validatePassword',async function (password) {
    const isValid = await bcrypt.compare(password,this.password);
    return isValid
    
})
export const User = mongoose.model('User',userSchema);
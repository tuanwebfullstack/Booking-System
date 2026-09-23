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

userSchema.pre('save', async function () {
    if(!this.isModified('password')) {
        return 
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.method('validatePassword',async function (password) {
    const isValid = await bcrypt.compare(password,this.password);
    return isValid
    
})
export const User = mongoose.model('User',userSchema);
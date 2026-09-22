import mongoose from "mongoose";

const tenantSchema  = new mongoose.Schema({
    name:{type: String, required:true, trim:true},
    phone:{type:String,default:'',trim:true},
    slug:{type:String,required:true,lowercase:true,trim:true,unique:true},
    address:{type:String, default:'',trim:true},
    logo:{type:String,default:'',trim:true},
    status:{type:String, enum:['pending', 'active', 'suspended'],default:'pending'},

},{
    timestamps:true
})
export const Tenant = mongoose.model('Tenant',tenantSchema);
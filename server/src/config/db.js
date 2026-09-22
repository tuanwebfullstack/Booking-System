import env from './env.js'
import mongoose from 'mongoose';
const  connectDB = async () =>{

    try {

        await mongoose.connect(env.mongoUri);
        console.log(`Mongo DB connection successful`);
    } catch (error) {
        console.log('MongoDB connection failed',error);
        process.exit(1);
    }
}

export default connectDB;
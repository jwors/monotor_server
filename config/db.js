import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    console.log(process.env.MONITOR_DB_URI)
    try {
        await mongoose.connect(process.env.MONITOR_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        process.exit(1)
    }
}

export default connectDB
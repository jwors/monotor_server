import express from 'express'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './routes/index.js'

// 加载环境变量
dotenv.config()


const app = express()

// 连接数据库
connectDB();

// 中间件
app.use(bodyParser.json());
app.use(cors());

// 路由
app.use(router)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app
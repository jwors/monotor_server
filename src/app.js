import express from 'express'
import connectDB from './config/db'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './routes'

const app = express()



// 连接数据库
connectDB();

// 中间件
app.use(bodyParser.json());
app.use(cors());

// 路由
app.use(router)
// app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PROT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
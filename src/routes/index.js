import express from 'express'
import userRoutes from './userRoutes.js'

const router = express.Router()

// 用户相关路由
router.use('/api/users', userRoutes)

// 错误日志路由
router.post('/getErrorLog', (req, res) => { 
	res.send({
		code: 200,
		data: [
			{
				time: '2020-01-01 01:01:01',
				type: 'error',
				message: 'error message'
			},
			{
				time: '2020-01-01 01:01:01',
				type: 'error',
				message: 'error message'
			}
		]
	})
})

export default router
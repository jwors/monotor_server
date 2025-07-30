import express from 'express'
import userRoutes from './userRoutes.js'

const router = express.Router()

// 用户相关路由
router.use('/api/users', userRoutes)

// 错误日志路由
router.post('/getErrorLog', (req, res) => { 
	res.json({
		code: 200,
		data: {
			list: [
				{
					timestamp: 1515530300000,
					username: 'admin',
					description: '添加了用户 admin'
				},
				{
					timestamp: 1518427664000,
					username: 'admin',
					description: '修改了菜单 菜单'
				}
			]
		}
	})
})

export default router
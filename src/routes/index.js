import express from 'express'

const router = express.Router()

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
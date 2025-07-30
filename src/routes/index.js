import express from 'express'

const router = express.Router()

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
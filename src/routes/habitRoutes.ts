import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'habits' })
})

router.get('/:id', (req, res) => {
  res.json({ message: 'one habit' })
})

router.post('/', (req, res) => {
  res.json({ message: 'created a habit' }).status(201)
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'removed habits' }).status(204)
})

router.post('/:id/compelete', (req, res) => {
  res.json({ message: 'completed the habit' })
})

export default router

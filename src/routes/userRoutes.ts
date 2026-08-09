import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'get all users' })
})

router.get('/:id', (req, res) => {
  res.json({ message: 'get a specific user' })
})

router.put('/:id', (req, res) => {
  res.json({ message: 'update a user' })
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'remove a user' })
})

export default router

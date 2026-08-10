import { Router } from 'express'
import z, { string } from 'zod'
import { vaildateBody, vaildateParam } from '../middleware/validtions.ts'

const router = Router()

const habitSchema = z.object({
  name: z.string(),
})

const habitParamSchema = z.object({
  id: z.string().min(3).max(10),
})

router.get('/', (req, res) => {
  res.json({ message: 'habits' })
})

router.get('/:id', (req, res) => {
  res.json({ message: 'one habit' })
})

router.post('/', vaildateBody(habitSchema), (req, res) => {
  res.json({ message: 'created a habit' }).status(201)
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'removed habits' }).status(204)
})

router.post(
  '/:id/complete',
  vaildateParam(habitParamSchema),
  vaildateBody(habitSchema),
  (req, res) => {
    res.json({ message: 'completed the habit' })
  },
)

export default router

import { Router } from 'express'
import z, { string } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import { vaildateBody, vaildateParam } from '../middleware/validtions.ts'
import {
  createHabit,
  getAllHabits,
  updateHabit,
} from '../controllers/habitsController.ts'

const router = Router()

router.use(authenticateToken)

const habitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequancy: z.string(),
  targetCount: z.number(),
  isActive: z.boolean(),
  tagIds: z.array(z.string()).optional(),
})

const habitParamSchema = z.object({
  id: z.string().min(3).max(10),
})

router.get('/', getAllHabits)

router.get('/:id', (req, res) => {
  res.json({ message: 'one habit' })
})

router.post('/', vaildateBody(habitSchema), createHabit)

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

router.patch('/:id', updateHabit)

export default router

import { Router } from 'express'
import { register, login } from '../controllers/authController.ts'
import { vaildateBody } from '../middleware/validtions.ts'
import { insertUserSchema } from '../DB/schema.ts'
import z from 'zod'

const router = Router()
const loginSchema = z.object({
  email: z.email('invalid email'),
  password: z.string().min(3, 'password min is 3 charaters long'),
})
router.post('/register', vaildateBody(insertUserSchema), register)

router.post('/login', vaildateBody(loginSchema), login)

export default router

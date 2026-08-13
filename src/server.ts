import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import cors from 'cors'
// @ts-ignore
import morgan from 'morgan'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorhandler.ts'
import { notFound } from './middleware/notFound.ts'

const app = express()

// external middelware
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))

// express middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ message: 'all good' }).status(200)
})

app.use('/api/users', userRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/habits', habitRoutes)

// 404 handler - MUST come after all valid routes
app.use(notFound)

// Global error handler - MUST be last
app.use(errorHandler)

export { app }

export default app

import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import cors from 'cors'
import morgen from 'morgan'
import helmet from 'helmet'

const app = express()

// external middelware
app.use(helmet())
app.use(cors())
app.use(morgen('dev'))

// express middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ message: 'all good' }).status(200)
})

app.use('/api/users', userRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/habits', habitRoutes)

export { app }

export default app

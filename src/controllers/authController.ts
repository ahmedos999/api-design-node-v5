import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { db } from '../DB/connection.ts'
import { users } from '../DB/schema.ts'

import type { NewUser, User } from '../DB/schema.ts'

import { generateToken } from '../utils/jwt.ts'
import { hashpassword, comparepasswords } from '../utils/password.ts'

import { eq } from 'drizzle-orm'

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response,
) => {
  try {
    const hashedpassword = await hashpassword(req.body.password)
    const [user] = await db
      .insert(users)
      .values({
        ...req.body,
        password: hashedpassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    res.status(201).json({ user, token })
  } catch (e) {
    console.log('Resgister error', e)
    res.status(500).json({ error: 'Failed to create user' })
  }
}

export const login = async (req: Request<any, any, User>, res: Response) => {
  try {
    const { email, password } = req.body
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) return res.json({ message: 'invalid credentials' })

    if (!(await comparepasswords(password, user.password)))
      return res.json({ message: 'invalid credentials' })

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return res.status(201).json({
      ...user,
      password: 'nice try',
      token,
    })
  } catch (e) {
    console.log('Login error', e)
    res.status(500).json({ error: 'Failed to login user' })
  }
}

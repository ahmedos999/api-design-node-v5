import bcrypt from 'bcrypt'
import env from '../../env.ts'

export const hashpassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS)
}

export const comparepasswords = async (
  password: string,
  hashedpassword: string,
) => bcrypt.compare(password, hashedpassword)

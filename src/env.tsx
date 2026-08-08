import { env as loadenv } from 'custom-env'
import { z } from 'zod'

process.env.APP_STAGE = process.env.APP_STAGE || 'development'

const isProduction = process.env.APP_STAGE === 'production'
const isDevelopment = process.env.APP_STAGE === 'development'
const isTest = process.env.APP_STAGE === 'test'

if (isDevelopment) {
  loadenv()
} else if (isTest) {
  loadenv('test')
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_STAGE: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().positive().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32, 'Must be 32 chars long'),
  JWT_EXPIRES: z.string().default('7d'),
  BYCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
})

export type ENV = z.infer<typeof envSchema>

let env: ENV

try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log('Invalid ENV file')
    console.error(JSON.stringify(z.treeifyError(e).errors, null, 2))

    e.issues.forEach((err) => {
      const path = err.path.join('.')
      console.log(`${path}: ${err.message}`)
    })

    process.exit(1)
  }
  throw e
}

export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'development'
export const isTesting = () => env.APP_STAGE === 'test'

export { env }
export default env

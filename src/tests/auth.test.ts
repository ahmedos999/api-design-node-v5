import request from 'supertest'
import { app } from '../server.ts'
import { cleanupDatabase, createTestUser } from './setup/dbhelper.ts'

describe('Auth Routes', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await cleanupDatabase()
  })

  describe('POST /auth/register', () => {
    it('should register a user', async () => {
      const userData = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'TestPassword123!',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      // Check that the response contains the user and token
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')

      // Check that the password is not returned in the response
      expect(response.body.user).not.toHaveProperty('password')

      expect(response.body.user.username).toBe(userData.username)
    })
  })

  describe('POST /auth/login', () => {
    it('should login a user', async () => {
      const { user } = await createTestUser({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'TestPassword123!',
      })

      console.log('Created test user:', user)
      const credentials = {
        email: user.email,
        password: 'TestPassword123!', // Use the raw password for login
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(201)

      // Check that the response contains the user and token
      expect(response.body).toHaveProperty('username')
      expect(response.body).toHaveProperty('token')

      // Check that the password is not returned in the response
      expect(response.body).toHaveProperty('password', 'nice try')

      expect(response.body.email).toBe(credentials.email)
    })
  })
})

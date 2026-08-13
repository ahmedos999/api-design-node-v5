import { createTestHabit, cleanupDatabase, createTestUser } from './dbhelper.ts'

describe('Setup Test', () => {
  it('should create a test user and habit', async () => {
    const { user, token } = await createTestUser()
    expect(user).toBeDefined()
    expect(token).toBeDefined()

    await cleanupDatabase()
  })
})

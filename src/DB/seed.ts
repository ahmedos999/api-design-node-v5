import { db } from './connection.ts'
import { users, habits, habitsTags, entries, tags } from './schema.ts'
import { pathToFileURL } from 'url'

const seed = async () => {
  try {
    // clearing database tables
    console.log('Clearing database tables...')
    await db.delete(habitsTags)
    await db.delete(entries)
    await db.delete(habits)
    await db.delete(users)

    // seeding data to tables
    console.log('Seeding data to tables...')
    const [demoUser] = await db
      .insert(users)
      .values({
        username: 'john_doe',
        email: 'john_doe@example.com',
        password: 'securepassword123',
      })
      .returning()

    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Exercise',
        frequancy: 'daily',
        description: 'Daily morning exercise routine',
      })
      .returning()

    const [tag1] = await db
      .insert(tags)
      .values({
        name: 'Health',
      })
      .returning()

    await db.insert(habitsTags).values({
      habitId: exerciseHabit.id,
      tagId: tag1.id,
    })

    // Step 6: Create historical completion data
    console.log('Adding completion entries...')
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    // Exercise habit - completions for past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
        note: i === 0 ? 'Great workout today!' : null,
      })
    }
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('Seeding database...')
  seed()
    .then(() => process.exit(0))
    .catch((e) => process.exit(1))
}

console.log(import.meta.url)
console.log(pathToFileURL(process.argv[1]).href)
export default seed

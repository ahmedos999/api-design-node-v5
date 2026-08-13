import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import db from '../DB/connection.ts'
import { habits, habitsTags } from '../DB/schema.ts'

import { eq, desc, and } from 'drizzle-orm'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequancy, targetCount, isActive, tagIds } =
      req.body

    const result = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          frequancy,
          name,
          userId: req.user!.id,
          description,
          targetCount,
          isActive,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagsValues = tagIds.map((tagId: string) => ({
          habitId: newHabit.id,
          tagId,
        }))

        await tx.insert(habitsTags).values(habitTagsValues)
      }

      return newHabit
    })

    res.status(201).json({
      message: 'Habit created successfully',
      habit: result,
    })
  } catch (error) {
    console.error('Create habit failed', error)
    res.status(500).json({ message: 'unexpected error' })
  }
}

export const getAllHabits = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userHabitswithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user!.id),
      with: {
        habitTags: {
          with: {
            tags: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    console.log(userHabitswithTags)

    const habitsWithTags = userHabitswithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tags),
      habitTags: undefined,
    }))

    res.status(200).json({
      habits: habitsWithTags,
    })
  } catch (error) {
    console.error('failed to fetch habits', error)
    res.status(500).json({
      message: 'unexpected error',
    })
  }
}

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    const { tagIds, ...updates } = req.body

    const result = await db.transaction(async (tx) => {
      const [updatedHabit] = await tx
        .update(habits)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(habits.id, id), eq(habits.userId, req.user!.id)))
        .returning()

      if (!updatedHabit) {
        return res
          .status(404)
          .json({ message: 'Habit not found or unauthorized' })
      }

      if (tagIds !== undefined) {
        await tx.delete(habitsTags).where(eq(habitsTags.habitId, id))

        if (tagIds.length > 0) {
          const habitTagsValues = tagIds.map((tagId: string) => ({
            habitId: id,
            tagId,
          }))
          await tx.insert(habitsTags).values(habitTagsValues)
        }
      }

      return updatedHabit
    })

    res.json({
      message: 'habit updated successfully',
      habits: result,
    })
  } catch (error) {
    console.error('Update habit failed', error)
    res.status(500).json({ message: 'unexpected error' })
  }
}

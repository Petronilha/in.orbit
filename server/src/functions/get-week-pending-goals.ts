import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, lte, sql, count, gte } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalCompletionCounts = db.$with('goal_Completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id),
      })
      .from(goalCompletions)
      .where(and(
        gte(goals.createdAt, firstDayOfWeek),
        lte(goals.createdAt, lastDayOfWeek)
      ))
      .groupBy(goalCompletions.goalId)
  )
}


1:28:00
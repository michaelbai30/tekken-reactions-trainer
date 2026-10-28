// stats.js contains the logic for tracking the user's performance statistics. 
// It is used by the main app to update the stats after each reaction test.

export const EMPTY_STATS = Object.freeze({ correct: 0, total: 0, streak: 0, best: 0 })

/**
 * @param {{ correct: number, total: number, streak: number, best: number }} stats
 * @param {boolean} isCorrect
 * @returns {{ correct: number, total: number, streak: number, best: number }}
 */

export function applyResult(stats, isCorrect){
    const newStreak = isCorrect ? stats.streak + 1 : 0    
    const newBest = Math.max(stats.best, newStreak)

    const newStats = {
        correct: stats.correct + (isCorrect ? 1 : 0),
        total: stats.total + 1,
        streak: newStreak,
        best: newBest
    }
    return newStats
}
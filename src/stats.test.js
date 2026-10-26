import { describe, expect, it} from 'vitest'
import { EMPTY_STATS, applyResult } from './stats.js'

describe('applyResult', () => {
  it('counts a correct answer and starts a streak', () => {
    expect(applyResult(EMPTY_STATS, true)).toEqual({ correct: 1, total: 1, streak: 1, best: 1 })
  })
  it('counts a wrong answer without starting a streak', () => {
    expect(applyResult(EMPTY_STATS, false)).toEqual({ correct: 0, total: 1, streak: 0, best: 0 })
  })
  it('extends the streak and increases best', () => {
    const s = { correct: 2, total: 2, streak: 2, best: 2 }
    expect(applyResult(s, true)).toEqual({ correct: 3, total: 3, streak: 3, best: 3 })
  })
  it('resets the streak on a miss but keeps best', () => {
    const s = { correct: 3, total: 3, streak: 3, best: 3 }
    expect(applyResult(s, false)).toEqual({ correct: 3, total: 4, streak: 0, best: 3 })
  })
  it('does not lower best when a current streak is shorter than the best', () => {
    const s = { correct: 5, total: 6, streak: 0, best: 5 }
    expect(applyResult(s, true)).toEqual({ correct: 6, total: 7, streak: 1, best: 5 })
  })
  it('does not mutate the stats it was given', () => {
    const s = { correct: 1, total: 1, streak: 1, best: 1 }
    applyResult(s, true)
    expect(s).toEqual({ correct: 1, total: 1, streak: 1, best: 1 })
  })
})

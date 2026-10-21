import { describe, it, expect } from 'vitest'
import { score } from './scoring.js'

const real = { startOfAttack: 30, impact: 43, shouldReact: true }
const decoy = { startOfAttack: 30, impact: 43, shouldReact: false }

describe('score on a real attack', () => {
  it('misses when nothing was pressed', () => {
    expect(score(null, real)).toEqual({ correct: false, reason: 'missed', reactionFrames: null })
  })
  it('hits on the last frame before impact and reports reaction time', () => {
    expect(score(42, real)).toEqual({ correct: true, reason: 'blocked', reactionFrames: 12 })
  })
  it('is late on the impact frame', () => {
    expect(score(43, real)).toEqual({ correct: false, reason: 'late', reactionFrames: 13 })
  })
  it('hits early presses but reports a negative reaction time', () => {
    expect(score(25, real)).toEqual({ correct: true, reason: 'blocked', reactionFrames: -5 })
  })
})

describe('score on a decoy', () => {
  it('holds correctly when the player does nothing', () => {
    expect(score(null, decoy)).toEqual({ correct: true, reason: 'held', reactionFrames: null })
  })
  it('is a false alarm when the player presses', () => {
    expect(score(40, decoy)).toEqual({ correct: false, reason: 'false-alarm', reactionFrames: 10 })
  })
})

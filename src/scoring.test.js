import { describe, it, expect } from 'vitest'
import { score } from './scoring.js'

const real = { startOfAttack: 30, impact: 43, shouldReact: true }
const decoy = { startOfAttack: 30, impact: 43, shouldReact: false }

describe('score on a real attack', () => {
  it('misses when nothing was pressed', () => {
    expect(score(null, real)).toEqual({ hit: false, reactionFrames: null })
  })
  it('hits on the last frame before impact and reports reaction time', () => {
    expect(score(42, real)).toEqual({ hit: true, reactionFrames: 12 })
  })
  it('misses on the impact frame', () => {
    expect(score(43, real)).toEqual({ hit: false, reactionFrames: 13 })
  })
  it('hits early presses but reports a negative reaction time', () => {
    expect(score(25, real)).toEqual({ hit: true, reactionFrames: -5 })
  })
})

describe('score on a decoy', () => {
  it('hits when the player correctly does nothing', () => {
    expect(score(null, decoy)).toEqual({ hit: true, reactionFrames: null })
  })
  it('misses when the player presses (false alarm)', () => {
    expect(score(40, decoy)).toEqual({ hit: false, reactionFrames: 10 })
  })
})

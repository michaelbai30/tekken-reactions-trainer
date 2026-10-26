/**
 * @param {number | null} pressedFrame
 * @param {{ startOfAttack: number, impact: number, shouldReact: boolean }} clip
 * @returns {{ correct: boolean, reason: 'blocked' | 'late' | 'missed' | 'held' | 'false-alarm', reactionFrames: number | null }}
 **/
export function score(pressedFrame, clip) {
  const pressed = pressedFrame !== null

  // reaction time, only defined if something was pressed
  const reactionFrames = pressed ? pressedFrame - clip.startOfAttack : null
  // decoy
  // no press is correct
  // any press is a false-alarm
  if (!clip.shouldReact) {
    return pressed
      ? { correct: false, reason: 'false-alarm', reactionFrames }
      : { correct: true, reason: 'held', reactionFrames }
  }

  // real attack
  if (!pressed){
    return { correct: false, reason: 'missed', reactionFrames } // no press is a miss
  }

  if (pressedFrame < clip.impact){
    return { correct: true, reason: 'blocked', reactionFrames }
  }
  return { correct: false, reason: 'late', reactionFrames }
}

// scoring.js: Contains logic for determining the score of a drill.
// exports score(pressedFrame, clip)

/**
 * @param {number | null} pressedFrame
 * @param {{ id: string, drill: string, startOfAttack?: number, impact?: number, shouldReact: boolean }} clip decoys don't have startOfAttack or impact 
 * @returns {{ correct: boolean, reason: 'blocked' | 'late' | 'missed' | 'held' | 'false-alarm', reactionFrames: number | null }}
 **/
export function score(pressedFrame, clip) {
  const pressed = pressedFrame !== null

  // reaction time, only defined if something was pressed and the clip has a start frame
  const reactionFrames = pressed && typeof clip.startOfAttack === 'number' ? pressedFrame - clip.startOfAttack : null

  // decoy: no press is correct, press is a false-alarm
  if (!clip.shouldReact) {
    return pressed
      ? { correct: false, reason: 'false-alarm', reactionFrames }
      : { correct: true, reason: 'held', reactionFrames }
  }

  // real attack
  if (!pressed){
    return { correct: false, reason: 'missed', reactionFrames } // no press is a miss
  }

  // allow just frame blocks
  if (pressedFrame <= clip.impact){
    return { correct: true, reason: 'blocked', reactionFrames }
  }
  return { correct: false, reason: 'late', reactionFrames }
}

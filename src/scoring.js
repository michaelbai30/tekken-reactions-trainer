/**
 * @param {number | null} pressedFrame
 * @param {{ tellStart: number, reactBy: number, shouldReact: boolean }} clip
 * @returns {{ hit: boolean, reactionFrames: number | null }}
 **/

export function score(pressedFrame, clip){
    const pressed = pressedFrame !== null

    // reaction time
    const reactionFrames = pressed ? pressedFrame - clip.startOfAttack : null // only defined if something is pressed

    // decoy: no press is correct
    if (!clip.shouldReact){
        return {hit: !pressed, reactionFrames}
    }

    // else real attack
    return {hit: pressed && pressedFrame < clip.impact, reactionFrames}
}

import { useEffect, useRef, useState } from 'react'
import { score } from './scoring.js'

const FPS = 60

const MESSAGES = {
  blocked: 'Nice block!',
  late: 'Too late!',
  missed: 'Missed the block',
  held: 'Good patience!',
  'false-alarm': 'Incorrect block',
}

function selectRandomClip(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

// One drill's loop
function Trainer({ clips, stats, onScored }) {
  const videoRef = useRef(null)

  const [frame, setFrame] = useState(0) // current value frame starting at 0 and function to change it

  const [status, setStatus] = useState('idle') // 'idle' | 'playing' | 'done'

  const frameRef = useRef(0)
  const pressedRef = useRef(null)
  const [result, setResult] = useState(null)

  const [clip, setClip] = useState(() => selectRandomClip(clips))
  const [round, setRound] = useState(0)

  const finishedRef = useRef(false)

  // stop the clip, score it, display result
  const finishClip = () => {
    if (finishedRef.current){
      return
    }
    finishedRef.current = true
    videoRef.current.pause() // <video> is an HTMLMediaElement
  
    // freeze on the frame where the user actually clicked
    if (pressedRef.current !== null) {
      videoRef.current.currentTime = (pressedRef.current + 0.5) / FPS // middle of the frame, so rounding can't pick a neighbour
      frameRef.current = pressedRef.current
      setFrame(pressedRef.current)
    }
    const res = score(pressedRef.current, clip)
    setResult(res)
    setStatus('done')
    onScored(res.correct)
  }


  const finishRef = useRef(finishClip)

  useEffect(() => {
    finishRef.current = finishClip
  })

  useEffect(() => {
    const video = videoRef.current
    let handle

    // metadata.mediaTime is the video timestamp in seconds of the frame currently on screen
    const onFrame = (now, metadata) => {
      const curFrame = Math.round(metadata.mediaTime * FPS)
      frameRef.current = curFrame
      setFrame(curFrame)
      // a click was registered: end the clip and score it
      if (pressedRef.current !== null && curFrame >= pressedRef.current) {
        finishRef.current()
        return
      }
      handle = video.requestVideoFrameCallback(onFrame) // re-registers the callback
    }

    handle = video.requestVideoFrameCallback(onFrame)
    return () => video.cancelVideoFrameCallback(handle)
  }, [round]) // re-attach to the new <video> element per round

  // --- Handlers ---
  const handleClick = () => {
    if (status === 'idle') {
      videoRef.current.play()
      setStatus('playing')
    } 
    else if (status === 'playing') {
      // Register a reaction on click
      if (pressedRef.current === null) {
        pressedRef.current = frameRef.current
      }
    }
  }

  const handleNext = () => {
    setClip(selectRandomClip(clips))
    setRound((r) => r + 1)
    setStatus('idle')
    setResult(null)
    setFrame(0)
    pressedRef.current = null
    finishedRef.current = false
  }


  return (
    <div>
      <video
        key={round}
        ref={videoRef}
        src={clip.src}
        muted
        playsInline
        width={640}
        onPointerDown={handleClick}
        onEnded={finishClip}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: 'pointer' }}
      />
      <p>Score: {stats.correct}/{stats.total} | Streak: {stats.streak} | Highest Streak: {stats.best}</p>
      <p>(Debug) Frame: {frame}</p>
      {status === 'idle' && <p>Click the video to start</p>}
      {status === 'done' && result && (
        <>
          <p>{MESSAGES[result.reason]}</p>
          {/* only show a reaction time for presses after the attack started*/}
          {result.reactionFrames > 0 && (
            <p>Reaction time: {result.reactionFrames} frames</p>
          )}
        </>
      )}
      {status === 'done' && <button onClick={handleNext}>Next clip</button>}
    </div>
  )
}

export default Trainer
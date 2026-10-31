// Trainer.jsx: Component that runs a single drill, loops through clips randomly, scores user input, and displays results

import { useEffect, useRef, useState } from 'react'
import { score } from './scoring.js'
import HelpModal from './HelpModal.jsx'

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
function Trainer({ clips, stats, onScored, drill}) {
  const videoRef = useRef(null)
  const frameRef = useRef(0)
  const pressedRef = useRef(null)
  const isFinishedRef = useRef(false)
  const handleClickRef = useRef(null)

  const [frame, setFrame] = useState(0) // current value frame starting at 0 and function to change it
  const [status, setStatus] = useState('idle') // 'idle' | 'playing' | 'done'
  const [result, setResult] = useState(null)
  const [clip, setClip] = useState(() => selectRandomClip(clips))
  const [round, setRound] = useState(0)

  // --- Handlers ---

  // stop the clip, score it, display result
  const finishClip = () => {
    if (isFinishedRef.current){
      return
    }
    isFinishedRef.current = true
    videoRef.current.pause() // <video> is an HTMLMediaElement
  
    // freeze on the frame where the user actually clicked
    if (pressedRef.current !== null) {
      videoRef.current.currentTime = (pressedRef.current + 0.5) / FPS
      frameRef.current = pressedRef.current
      setFrame(pressedRef.current)
    }
    const res = score(pressedRef.current, clip)
    setResult(res)
    setStatus('done')
    onScored(res.correct)
  }

   const handleNext = () => {
    setClip(selectRandomClip(clips))
    setRound((r) => r + 1)
    setStatus('idle')
    setResult(null)
    setFrame(0)
    pressedRef.current = null
    isFinishedRef.current = false
  }

  const handleClick = (canAdvance = true) => {
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

    else if (status === 'done') {
      if (canAdvance) {
        handleNext()
      }
    }
  }

 

  const finishClipRef = useRef(finishClip)
  useEffect(() => {
    finishClipRef.current = finishClip
  })

  useEffect(() => {
    handleClickRef.current = handleClick
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
        finishClipRef.current()
        return
      }
      handle = video.requestVideoFrameCallback(onFrame) // re-registers the callback
    }

    handle = video.requestVideoFrameCallback(onFrame)
    return () => video.cancelVideoFrameCallback(handle)
  }, [round]) // re-attach to the new <video> element per round

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.matches('input, textarea') || e.target.closest('dialog')){
        return
      }
      // don't trigger on key combos
      if (e.ctrlKey || e.metaKey || e.altKey){
        return
      }
      if (e.code === 'Space' || e.code === 'KeyS' || e.code === 'ArrowDown'){
        e.preventDefault() // stops default scrolling behavior
        if (e.repeat){
          return
        }
        handleClickRef.current(e.code === 'Space') // only allow advancing on Space
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])


  return (
    <div>
      <video
        key={round}
        ref={videoRef}
        src={clip.src}
        muted
        playsInline
        width={960}
        onPointerDown={handleClick}
        onEnded={finishClip}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: 'pointer' }}
      />
      <p></p>
      {status !== 'playing' && (
        <HelpModal
          drill={drill}
        />
      )}
      <p>Score: {stats.correct}/{stats.total} | Streak: {stats.streak} | Highest Streak: {stats.best}</p>
      <p>(Debug) Frame: {frame}</p>
      {status === 'idle' && <p>Click the video or press Space to start</p>}
      {status === 'done' && result && (
        <>
          <p> Click the video or press Space for the next clip</p>
          <p>{MESSAGES[result.reason]}</p>
          {/* only show a reaction time for presses after the attack started*/}
          {result.reactionFrames > 0 && (
            <p>Reaction time: {result.reactionFrames} frames</p>
          )}
        </>
      )}
    </div>
  )
}

export default Trainer
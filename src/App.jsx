import { useEffect, useRef, useState } from 'react'
import { score } from './scoring.js'
import clips from './clips.json' // array of the objs found in the json file

const FPS = 60

const MESSAGES = {
  blocked: 'Nice block!',
  late: 'Too late!',
  missed: 'Missed the block',
  held: 'Good patience!',
  'false-alarm': 'Blocked wrong',
}

function selectRandomClip(){
  return clips[Math.floor(Math.random() * clips.length)]
}

// Component
function App() {
  const videoRef = useRef(null)

  // e.g calling setFrame(5) makes React re-run App() w/ frame == 5
  const [frame, setFrame] = useState(0) // current value frame starting at 0 and function to change it

  const [status, setStatus] = useState('idle') // 'idle' | 'playing' | 'done'

  const frameRef = useRef(0)
  const pressedRef = useRef(null)
  const [result, setResult] = useState(null)

  const [clip, setClip] = useState(selectRandomClip)
  const [round, setRound] = useState(0)
  const [stats, setStats] = useState({ correct: 0, total: 0, streak: 0, best: 0 })

  useEffect(() => {
    const video = videoRef.current
    let handle

    // metadata.mediaTime is the video timestamp in seconds of the frame currently on screen
    const onFrame = (now, metadata) => {
      const curFrame = Math.round(metadata.mediaTime * FPS)
      frameRef.current = curFrame
      setFrame(curFrame)
      handle = video.requestVideoFrameCallback(onFrame) // re-registers the callback
    }

    handle = video.requestVideoFrameCallback(onFrame)
    return () => video.cancelVideoFrameCallback(handle)
  }, [round]) // re-attach to the new <video> element per round

  const handleClick = () => {
    if (status === 'idle'){
      videoRef.current.play()
      setStatus('playing')
    }
    else if (status === 'playing'){
      // Register a reaction on click
      if (pressedRef.current === null){
        pressedRef.current = frameRef.current        
      }
    }
  }

  const handleClipEnded = () => {
    const res = score(pressedRef.current, clip)
    setResult(res)
    setStatus('done')
    setStats((s) => {
      const streak = res.correct ? s.streak + 1 : 0
      return{
        correct: s.correct + (res.correct ? 1 : 0),
        total: s.total + 1,
        streak,
        best: Math.max(streak, s.best),
      }
    })
  }

  const handleNext = () => {
    setClip(selectRandomClip)
    setRound((r) => r + 1)
    setStatus('idle')
    setResult(null)
    setFrame(0)
    pressedRef.current = null
  }

  return (
    <div>
      <h1>Tekken Reaction Trainer</h1>
      <video
        key={round}
        ref={videoRef}
        src={clip.src}
        muted
        playsInline
        width={640}
        onClick={handleClick}
        onEnded={handleClipEnded}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: 'pointer' }}
      />
      <p>Score: {stats.correct}/{stats.total} | Streak: {stats.streak} | Best: {stats.best}</p>
      <p>Frame: {frame}</p>
      {status === 'idle' && <p>Click the video to start</p>}
      {status === 'done' && <p>Clip over</p>}
      {status === 'done' && result && (
        <>
          <p>{MESSAGES[result.reason]}</p>
          {result.reactionFrames !== null && (
            <p>Reaction time: {result.reactionFrames} frames</p>
          )}
        </>
      )}
      {status === 'done' && <button onClick={handleNext}>Next clip →</button>}
    </div>
  )
}


export default App

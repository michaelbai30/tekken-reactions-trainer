import { useEffect, useRef, useState } from 'react'
import { score } from './scoring.js'
import clips from './clips.json' // array of the objs found in the json file

const FPS = 60

// Component
function App() {
  const videoRef = useRef(null)

  // e.g calling setFrame(5) makes React re-run App() w/ frame == 5
  const [frame, setFrame] = useState(0) // current value frame starting at 0 and function to change it

  const [status, setStatus] = useState('idle') // 'idle' | 'playing' | 'done'

  const frameRef = useRef(0)
  const pressedRef = useRef(null)
  const [result, setResult] = useState(null)

  const clip = clips[0] // hardcoded for now

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
  }, [])

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
    setResult(score(pressedRef.current, clip))
    setStatus('done')
  }

  return (
    <div>
      <h1>Tekken Reaction Trainer</h1>
      <video
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
      <p>Frame: {frame}</p>
      {status === 'idle' && <p>Click the video to start</p>}
      {status === 'done' && <p>Clip over</p>}
      {status === 'done' && result && (
        <p>
          {result.hit ? 'Success' : 'Fail'}
          {result.reactionFrames !== null && ` (reaction: ${result.reactionFrames} frames)`}
        </p>
      )}
    </div>
  )
}


export default App

import Trainer from './Trainer.jsx'
import { useState } from 'react'
import { DRILLS } from './drills.js'
import clips from './clips.json' // array of the objs found in the json file
import logo from './assets/tekken-react-logo.png'

function App() {
  const [drillId, setDrillId] = useState(DRILLS[0].id)

  const pool = clips.filter((clip) => clip.drill === drillId)

  return (
    <div>
      <img
        src={logo}
        alt="Tekken React"
        width={640}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div role="tablist">
        {DRILLS.map((drill) => (
          <button
            key={drill.id}
            role="tab"
            aria-selected={drill.id === drillId}
            onClick={() => setDrillId(drill.id)}
          >
            {drill.name}
          </button>
        ))}
      </div>
      {pool.length === 0 ? (<p>No clips yet.</p>) : (<Trainer key={drillId} clips={pool} />)}
    </div>
  )
}

export default App

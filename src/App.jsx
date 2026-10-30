import Trainer from './Trainer.jsx'
import { useState, useEffect} from 'react'
import { DRILLS } from './drills.js'
import { applyResult, EMPTY_STATS } from './stats.js'
import { loadStats, saveStats } from './storage.js'
import clips from './clips.json' // array of the objs found in the json file
import logo from './assets/tekken-react-logo.png'


function App() {

  const [statsByDrill, setStatsByDrill] = useState(loadStats)
  const [drillId, setDrillId] = useState(DRILLS[0].id)
  const pool = clips.filter((clip) => clip.drill === drillId)

  /**
   * handler for when a drill is scored (correct or incorrect)
   * called when the Trainer component calls onScored()
   * @param {boolean} isCorrect 
   */
  const handleScored = (isCorrect) => {
    setStatsByDrill((drillMap) => {
      // get the current stats for this drill, or use EMPTY_STATS if none exist yet
      const curStats = drillMap[drillId] ?? EMPTY_STATS
      return { ...drillMap, [drillId]: applyResult(curStats, isCorrect) }
    })
  }

  // save whenever the stats change
  useEffect(() => {
    saveStats(statsByDrill)
  }, [statsByDrill])

  return (
    <div>
      <img
        src={logo}
        alt="Tekken React"
        width={960}
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
      {pool.length === 0 ? (<p>No clips yet.</p>) : (
        <Trainer
          key={drillId}
          clips={pool}
          stats={statsByDrill[drillId] ?? EMPTY_STATS}
          onScored={handleScored}
        />
      )}
    </div>
  )
}

export default App

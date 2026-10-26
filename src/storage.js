const STORAGE_KEY = 'tekken-reactions-trainer-stats-v1'

/**
 * @typedef {{ correct: number, total: number, streak: number, best: number }} Stats
 */

/**
 * Check if stats is a valid Stats object (well-formed)
 * @param {*} stats
 * @returns {boolean}
 */
function isValidStats(stats){
    return (
        typeof stats === 'object' && stats !== null &&
        typeof stats.correct === 'number' &&
        typeof stats.total === 'number' &&
        typeof stats.streak === 'number' &&
        typeof stats.best === 'number'
    )
}

/**
 * Loads the saved stats for every drill from localStorage.
 * Returns {} if nothing is saved. 
 * If the saved data is bad, it is cleared and {} is returned.
 * @returns {Record<string, Stats>} key = drill id, value = stats for that drill
 */
export function loadStats(){
    try{
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw){
            return {}
        }
        const parsed = JSON.parse(raw)
        // must be a plain object whose every value is a valid stats object
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)){
            throw new Error('Saved stats are not an object')
        }
        if (!Object.values(parsed).every(isValidStats)){
            throw new Error('Invalid stats types')
        }
        return parsed
    }
    // if reading or parsing fails, clear the saved stats and create new empty stats object
    catch (e) {
        console.error('Error loading stats:', e)
        localStorage.removeItem(STORAGE_KEY)
        return {}
    }
}

/**
 * Saves the stats for every drill to localStorage.
 * @param {Record<string, Stats>} statsByDrill
 * e.g statsByDrill = {
 *   'bryan-snake-edge': { correct: 5, total: 10, streak: 2, best: 3 },
 *   'jin-d2': { correct: 3, total: 5, streak: 1, best: 2 },
 * }
 */
export function saveStats(statsByDrill){
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statsByDrill))
    }
    catch (e){
        console.error('Error saving stats:', e)
    }
}

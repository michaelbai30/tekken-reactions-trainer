// HelpModal.jsx: Component that displays a modal with help information for each drill
import { useRef, useState } from 'react'

function HelpModal({drill}) {

    const [isOpen, setIsOpen] = useState(false)
    const dialogRef = useRef(null)



    return( 
    <>
    <button className="help-button" aria-label="Help" onClick={() => {setIsOpen(true); dialogRef.current.showModal()}}>?</button>
    <dialog ref={dialogRef} onClose={() => setIsOpen(false)}>
        <h2>{drill.help.title}</h2>
        <h4>How to play</h4>
        <ul>
            <li>Click the video or press Space to start the drill.</li>
            <li>Block before the move shown in the example hits by clicking the video or pressing Space, S, or ↓.</li>
            <li>If it's a different move, don't press anything.</li>
        </ul>
        <h4>About this drill</h4>
        <p>{drill.help.about}</p>
        <div>
            {isOpen && (
                <video muted autoPlay loop playsInline style={{ maxWidth: '100%', height: 'auto' }} src={drill.example}></video>
            )}
        </div>
        <button style={{ display: 'block', margin: '5px auto 0' }} onClick={() => dialogRef.current.close()}>Close</button>


    </dialog>
    </>
    )
}
export default HelpModal
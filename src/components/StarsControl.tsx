import { useContext, useState, useRef, useEffect } from "react"
import { SpaceTravelContext } from "../context/SpaceTravelContext"
import styles from './StarsControl.module.css'

export default function StarsControl() {
    const { travelMode, changeMode, stars } = useContext(SpaceTravelContext)

    // might add animation later
    // const [animating, setAnimating] = useState(false)
    const [pathFound, setPathFound] = useState(false)
    
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const goIntoSpace = () => {
        if (stars?.selected.length !== 2) {
            alert('Please choose at least 2 stars')
            return
        }
        stars?.findShortestPath()
        setPathFound(true)
    }

    const travelAgain = (newPath=false) => {
        stars?.clear(newPath)
        if (newPath) {
            stars?.generatePath()
        }       
        stars?.drawPath()
        setPathFound(false)
    }

    useEffect(() => {
        if (canvasRef.current === null || stars === null) return

        stars.setUpCanvas(canvasRef.current)
    }, [canvasRef])

    useEffect(() => {
        if (travelMode) {
            stars?.generatePath()

            setTimeout(() => {
                stars?.drawPath()
            }, 700)
        } else {
            setPathFound(false)
            stars?.clear(true)   // also clear all paths
        }
    }, [travelMode])
    
    return (
        <>
            <canvas ref={canvasRef}></canvas>

            { travelMode &&
                <div className={styles['travel-control']}>
                    {pathFound 
                        ? (
                            <div className={styles['flex-container']}>
                                <button
                                    onClick={() => travelAgain()}
                                    className={styles['blue-btn']}
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => travelAgain(true)}
                                    className={styles['blue-btn']}
                                >
                                    New Path
                                </button>
                                <button
                                    onClick={() => changeMode(false)}
                                    className={styles['orange-btn']}
                                >
                                    Cancel
                                </button>
                            </div>
                        )
                        : (
                            <div className={styles['selecting-wrapper']}>
                                <h3>Select Your Start and Destination</h3>
                                <div className={styles['flex-container']}>
                                    <button
                                        onClick={goIntoSpace}
                                        className={styles['blue-btn']}
                                    >
                                        Travel
                                    </button>
                                    <button
                                        onClick={() => changeMode(false)}
                                        className={styles['orange-btn']}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            }         
        </>
    )
}
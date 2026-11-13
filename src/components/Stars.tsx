import { useContext, useEffect, useRef } from 'react';
import { SpaceTravelContext } from '../context/SpaceTravelContext';
import { STARS_NUM } from '../utils/spaceTravel';
import StarsControl from './StarsControl';
import styles from './Stars.module.css'


export default function Stars() {
    const { stars, travelMode } = useContext(SpaceTravelContext)

    const focusedStarRef = useRef<number>()
    // const [state, setState] = useState(false)

    // const rerenderStars = () => {
    //     setState(state => !state)
    // }

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        // set the focused star to 'undefined' when the focus leave the children (stars)
        if (!e.currentTarget.contains(e.relatedTarget)) {
            focusedStarRef.current = undefined
        }
    }

    // Accessibility
    // But there's a bug: when we first click Tab to navigate the stars, it starts somewhere in the middle.
    // How I implement this might interfere the default behaviour, which I still don't understand why.
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (focusedStarRef.current === undefined) return

            switch(e.code) {
                case 'Enter':
                    stars?.select(focusedStarRef.current)
            }
        }

        document.addEventListener('keydown', handler)

        return () => {
            document.removeEventListener('keydown', handler)
        }
    }, [])

    return (
        <>
            { stars !== null && (
                <div 
                    className={styles.container}
                    onBlur={handleBlur} 
                    tabIndex={-1}  
                >
                    {[...Array(STARS_NUM)].map((a, i) => {  
                        let x: number
                        let y: number
                        
                        if (stars.all.length < STARS_NUM) {
                            // stars span full width of the screen
                            x = Math.round((Math.random() * 100) * stars.w / 100);

                            // stars span top 70% of the screen
                            y = Math.round((Math.random() * 70) * stars.h / 100);

                            stars.add(x, y)
                        } else {
                            // stars are already generated
                            x = stars.all[i].x
                            y = stars.all[i].y
                        }   
                        
                        const cssStyles: React.CSSProperties = {
                            top: y,
                            left: x,
                        }

                        if (travelMode) {
                            return (
                                <div 
                                    key={i} 
                                    style={cssStyles} 
                                    className={styles['static-star']}
                                    onClick={() => stars.select(i)}
                                    onFocus={() => focusedStarRef.current = i }
                                    tabIndex={Math.round((x * 100 / stars.w) + (y * 10000 / stars.h))}
                                ></div>
                            )
                        }

                        const sizeClass = `size-${x % 3}`;
                        const colorClass = `color-${y % 3}`;
                        cssStyles.animationDuration = `${((x + y) % 3) + 2 + (i / 10)}s`
                        
                        return (
                            <div 
                                key={i} 
                                style={cssStyles} 
                                className={`${styles[sizeClass]} ${styles[colorClass]}`}
                                onClick={a}    // a is undefined
                                tabIndex={a}
                            ></div>
                        )
                    })}
                </div>
            )}  

            <StarsControl />
        </>
    )
}
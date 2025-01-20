import React, { useEffect, useRef, useState } from 'react'
import styles from './TimeValueWrapper.module.css'

type Props = {
    label: string
    timeValue: string
}

function TimeValueWrapper({ label, timeValue }: Props) {

    const [delayedVal, setDelayedVal] = useState('')

    const overlayRef = useRef<HTMLDivElement>(null);

    function animationFinished() {
        overlayRef.current?.classList.remove(styles.flip);
        
        setDelayedVal(timeValue)
    }

    useEffect(() => {
        setDelayedVal(timeValue)
    }, [])

    useEffect(() => {
        if (!overlayRef.current) return

        overlayRef.current.classList.add(styles.flip);
    }, [timeValue])

    return (
        <div className={styles.container}>
            <div className={styles['time-container']}>

                {/* The reason for nesting tiny circle inside every segment is that the circle is going to overflow, and the container can't be set 'overflow: hidden;', because that will cut 3D animation as well  */}
                <div className={styles.top}>
                    {timeValue}
                    <div className={styles.screen}></div>
                    <div className={styles['tiny-circle-left']}></div>
                    <div className={styles['tiny-circle-right']}></div>
                </div>
                <div className={styles.bottom}>
                    {delayedVal}
                    <div className={styles['tiny-circle-left']}></div>
                    <div className={styles['tiny-circle-right']}></div>
                </div>
                
                <div 
                    className={`${styles.overlay}`}
                    ref={overlayRef}
                >
                    <div className={styles['overlay-top']} onAnimationEnd={animationFinished}>
                        {delayedVal}
                        <div className={styles.screen}></div>
                        <div className={styles['tiny-circle-left']}></div>
                        <div className={styles['tiny-circle-right']}></div>
                    </div>
                    <div className={styles['overlay-bottom']}>
                        {timeValue}
                        <div className={styles['tiny-circle-left']}></div>
                        <div className={styles['tiny-circle-right']}></div>
                    </div>
                </div>
            </div>
            <p className={styles.label}>{label}</p>
        </div>
    )
}

export default React.memo(TimeValueWrapper);
import styles from './Stars.module.css'

export default function Stars() {
    return (
        <div className={styles.container}>
            {[...Array(30)].map((x, i) => {                
                const topVal = Math.floor(Math.random() * 70);
                const leftVal = Math.floor(Math.random() * 100);

                const sizeClass = `size-${topVal % 3}`;
                const colorClass = `color-${leftVal % 3}`;

                const cssStyles: React.CSSProperties = {
                    top: `${topVal}vh`,
                    left: `${leftVal}vw`,
                    animationDuration: `${((topVal + leftVal) % 3) + 2 + (i / 10)}s`
                }
                
                return (
                    <div 
                        key={i} 
                        style={cssStyles} 
                        className={`${styles[sizeClass]} ${styles[colorClass]}`}
                    ></div>
                )
            })}
        </div>
    )
}
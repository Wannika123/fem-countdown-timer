import { addLeadingZero } from "../utils/addLeadingZero";
import { useCountdown } from "../hooks/useCountdown";
import TimeValueWrapper from "./TimeValueWrapper";
import styles from './Countdown.module.css';

export default function Countdown() {

    const { days, hours, minutes, seconds } = useCountdown();

    return (
        <div className={styles.container}>
            <TimeValueWrapper timeValue={addLeadingZero(days)} label="days" />
            <TimeValueWrapper timeValue={addLeadingZero(hours)} label="hours" />
            <TimeValueWrapper timeValue={addLeadingZero(minutes)} label="minutes" />
            <TimeValueWrapper timeValue={addLeadingZero(seconds)} label="seconds" />
        </div>
    )
}
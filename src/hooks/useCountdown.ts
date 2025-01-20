import { useEffect, useState } from "react";

export function useCountdown() {
    const [nowTime, setNowTime] = useState(Date.now());   // milliseconds
    const [endTime, setEndTime] = useState<number>();

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (endTime) {
        const timeRemaining = endTime - Math.floor(nowTime / 1000);

        days = Math.floor(timeRemaining / 24 / 60 / 60);
        hours = Math.floor(timeRemaining / 60 / 60) - (days * 24);
        minutes = Math.floor(timeRemaining / 60) - (days * 24 * 60) - (hours * 60);
        seconds = timeRemaining % 60;
    }

    useEffect(() => {
        const savedEndTime = localStorage.getItem('end-time');

        if (savedEndTime) {
            setEndTime(Number(savedEndTime))
        } else {
            const fourteenDays = 14 * 24 * 60 * 60;    // in seconds
            const endTime = Math.floor(nowTime / 1000) + fourteenDays;

            setEndTime(endTime);
            localStorage.setItem('end-time', JSON.stringify(endTime));
        }
    }, []);

    useEffect(() => {
        if (!endTime) return

        const countdown = setInterval(() => {
            setNowTime(Date.now());

            if (Math.floor(nowTime / 1000) >= endTime) {
                clearInterval(countdown);
            }
        }, 1000);

        return () => { clearInterval(countdown) }

    }, [endTime])

    return { days, hours, minutes, seconds }
}
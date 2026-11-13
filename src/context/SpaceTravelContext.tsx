import { createContext, useRef, useState } from "react";
import { Stars } from "../utils/spaceTravel";


type ContextType = {
    travelMode: boolean
    changeMode: (travel: boolean) => void
    stars: Stars | null
}

export const SpaceTravelContext = createContext<ContextType>({
    travelMode: false,
    changeMode: () => {},
    stars: null
})

export function SpaceTravelProvider({ children }: {
    children: React.ReactNode
}) {
    const [travelMode, setTravelMode] = useState(false)

    const starsRef = useRef<Stars | null>(null)

    if (starsRef.current === null) {
        starsRef.current = new Stars()
    }

    const changeMode = (travel: boolean) => {
        setTravelMode(travel)
    }

    return (
        <SpaceTravelContext.Provider value={{ 
            travelMode, 
            changeMode,
            stars: starsRef.current
        }}>
            { children }
        </SpaceTravelContext.Provider>
    )
}
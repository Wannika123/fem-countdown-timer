import { Star, PriorityQueue, findDistance } from "./spaceTravel"

// state of the star
type State = {
    visited: boolean
    previous: number | null
    distance: number
}

export function dijkstra(stars: Star[], start: number, end: number) {
    const states: State[] = []  

    // initialize the state of each star
    for (let i = 0; i < stars.length; i++) {
        states.push({
            visited: false,
            previous: null,
            distance: Infinity
        })
    }
    states[start].distance = 0

    const queue = new PriorityQueue()
    queue.addTask([start, 0])

    while (!states[end].visited) {
        const task = queue.pop()
        if (!task) {
            // There's no way to the destination
            break
        }
        const [id, distance] = task     // Reminder - id is the index
        states[id].visited = true

        const visitingStar = stars[id] 
        for (const nei of visitingStar.neighbors) {
            if (states[nei.starId].visited) {
                continue
            }
            const newDist = distance + nei.distance
            if (newDist < states[nei.starId].distance) {
                states[nei.starId].distance = newDist
                states[nei.starId].previous = visitingStar.id
                queue.addTask([nei.starId, newDist])
            }
        }
    }
    // will return shortest path
    const path: number[] = []
    let currStar: number

    if (states[end].previous === null) {
        // There's no way to the destination star. 
        // So, go to the star that's nearest to the destination instead.
        const nearestStar = {
            id: start,
            distance: findDistance(stars[start], stars[end])
        }
        for (let i = 0; i < stars.length; i++) {
            if (!states[i].visited) {
                // Skip when there's no path to the star
                continue
            }

            const dist = findDistance(stars[i], stars[end])
            if (dist < nearestStar.distance) {
                nearestStar.id = i
                nearestStar.distance = dist
            }
        }
        path.push(nearestStar.id)
        currStar = states[nearestStar.id].previous as number
    } else {
        path.push(end)
        currStar = states[end].previous 
    }
    
    while (currStar !== start) {
        path.push(currStar)

        const prevStar = states[currStar].previous
        if (prevStar === null) {
            break   // Just for TS, it shouldn't be null anyway.
        }    
        currStar = prevStar
    }
    path.push(start)  // add starting star
    return path.reverse()
}

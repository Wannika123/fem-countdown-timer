import { dijkstra } from "./dijkstra"


export const STARS_NUM = 50

export class PriorityQueue {
    tasks: [number, number][] = []    // 1st elem is startId, 2nd elem is distance

    addTask(task: [number, number]) {
        const index = this.tasks.findIndex(t => t[0] === task[0])
        if (index >= 0) {
            // delete existing task of the same star 
            // (if implemented correctly, newly added one has shorter distance, so no need to check ...)
            this.tasks.splice(index, 1)
        }
        this.tasks.push(task)
        this.tasks.sort((a, b) => b[1] - a[1])   // sort according to the distance (2nd elem), from longest to shortest
    }

    pop() {
        return this.tasks.pop()
    }
}

class Neighbor {
    _starId: number
    _distance: number

    constructor(starId: number, dist: number) {
        this._starId = starId
        this._distance = dist
    }

    get starId() {
        return this._starId
    }

    get distance() {
        return this._distance
    }
}

export class Star {
    _id: number
    _x: number
    _y: number
    neighbors: Neighbor[] = []
    
    constructor(id: number, x: number, y: number) {
        this._id = id
        this._x = x
        this._y = y
    }

    get id() {
        return this._id
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    addNeighbor(starId: number, dist: number) {
        this.neighbors.push(new Neighbor(starId, dist))
    }

    hasNeighbor(starId: number) {
        const neighborsId = this.neighbors.map(nei => nei.starId)
        return neighborsId.includes(starId)
    }
}

export function findDistance(star1: Star, star2: Star) {
    // distance between 2 stars (pythagorus)
    return Math.round(Math.sqrt(
        Math.pow(star1.x - star2.x, 2) + Math.pow(star1.y - star2.y, 2)
    ))
}

export class Stars {
    // (all stars) should have the length of STARS_NUM
    all: Star[] = []   

    // (selected stars) maximum length is 2 - 1st elem is start, 2nd is destination
    selected: number[] = []  

    pathFound = false

    // canvas stuff
    canvas: HTMLCanvasElement | null = null
    ctx: CanvasRenderingContext2D | null = null
    w = window.innerWidth
    h = window.innerHeight
    rad = 3   // radius

    add(x: number, y: number) {
        this.all.push(new Star(this.all.length, x, y))
    }

    generatePath() {
        // The path won't be longer than max distance, so that the path is not too messy
        const maxDist = Math.min(this.w, this.h) / 2
        console.log(this.all.length)

        for (let i = 0; i < this.all.length; i++) {
            const star = this.all[i]

            for (let x = 0; x <= 7; x++) {
                const randIndex = Math.floor(Math.random() * this.all.length)
                if (randIndex === i || star.hasNeighbor(randIndex)) continue

                const randStar = this.all[randIndex]

                const distance = findDistance(star, randStar)

                // If the distance is more than max distance, do not add neighbor
                if (distance > maxDist) {
                    if (x !== 7 || star.neighbors.length !== 0) {
                        continue
                    } 
                }
                // But if this is the last loop and the star still doesn't have neighbor, add it anyway.

                // Actually add the neighbor
                star.addNeighbor(randIndex, distance)

                // neighbors is symmetrical relationship
                randStar.addNeighbor(i, distance)

                // each star should have around 2-5 neighbors
                if (star.neighbors.length >= 5) break   
            }
        }
    }

    findShortestPath() {
        if (this.selected.length !== 2) return

        const path = dijkstra(this.all, this.selected[0], this.selected[1])
        this.drawShortestPath(path)
        this.pathFound = true
    }

    setUpCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.canvas.width = this.w
        this.canvas.height = this.h
        this.ctx = this.canvas.getContext('2d')
    }

    drawPath() {
        if (this.ctx === null) return

        for (const star of this.all) {
            for (const nei of star.neighbors) {
                const neiId = nei.starId
                if (neiId < star.id) {
                    // drawn
                    continue
                }
                this.ctx.strokeStyle = 'rgb(79, 71, 102)'
                this.ctx.lineWidth = 0.5

                this.ctx.beginPath()
                this.ctx.moveTo(star.x, star.y)
                this.ctx.lineTo(this.all[neiId].x, this.all[neiId].y)
                this.ctx.stroke()
            }
        }
    }

    drawShortestPath(path: number[]) {
        if (this.ctx === null) return

        for (let i = 0; i < path.length - 1; i++) {
            const currStar = this.all[path[i]]
            const nextStar = this.all[path[i + 1]]

            // draw current star (circle)
            this.ctx.fillStyle = 'rgb(0, 230, 142)'
            this.ctx.beginPath()
            this.ctx.arc(currStar.x, currStar.y, this.rad, 0, Math.PI * 2)
            this.ctx.fill()

            // draw line to the next star
            this.ctx.strokeStyle = 'rgb(0, 230, 142)'
            this.ctx.lineWidth = 0.5
            this.ctx.beginPath()
            this.ctx.moveTo(currStar.x, currStar.y)
            this.ctx.lineTo(nextStar.x, nextStar.y)
            this.ctx.stroke()
        }
        const lastStar = this.all[path[path.length - 1]]

        // draw last star (circle)
        this.ctx.fillStyle = 'rgb(0, 230, 142)'
        this.ctx.beginPath()
        this.ctx.arc(lastStar.x, lastStar.y, this.rad, 0, Math.PI * 2)
        this.ctx.fill()
    }

    select(starId: number) {     // Reminder - starId is index
        if (this.pathFound) return
        
        const draw = (x: number, y: number) => {
            if (this.ctx === null) return

            this.ctx.fillStyle = 'lime'
            this.ctx.beginPath()
            this.ctx.arc(x, y, this.rad, 0, Math.PI * 2)
            this.ctx.fill()
        }

        const erase = (x: number, y: number) => {
            if (this.ctx === null) return

            this.ctx.globalCompositeOperation = 'destination-out'
            this.ctx.beginPath()
            this.ctx.arc(x, y, this.rad, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.globalCompositeOperation = 'source-over'
        }

        if (this.selected.includes(starId)) {
            // cancel selected star
            const i = this.selected.findIndex(x => x === starId)
            this.selected.splice(i, 1)

            erase(this.all[starId].x, this.all[starId].y)
        } else if (this.selected.length < 2) {
            this.selected.push(starId)

            draw(this.all[starId].x, this.all[starId].y)
        } else {
            const i = this.selected.pop() as number
            this.selected.push(starId)
          
            erase(this.all[i].x, this.all[i].y)
            draw(this.all[starId].x, this.all[starId].y)
        }
    }

    clear(newPath=false) {
        // clear canvas
        // (Firefox problem, ok in Chrome) this.ctx?.clearRect(0, 0, this.w, this.h) somehow doesn't work ...
        this.ctx?.clearRect(0, 0, this.w - 1, this.h - 1)      
        this.selected = []
        this.pathFound = false

        if (newPath) {
            // Clear the neighbors of each star. (stars are still there)
            for (let i = 0; i < this.all.length; i++) {
                this.all[i].neighbors = []
            }
        }
    }
}

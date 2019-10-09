const Direction = Object.freeze({
  DOWN: -1,
  NONE: 0,
  UP: 1
})

const Priority = Object.freeze({
  HIGH: 1,
  AVERAGE: 10,
  LOW: 30,
  NEVER: Infinity
})

function compare(a, b) {
  return Math.sign(a - b)
}

function diff(a, b) {
  return Math.abs(a - b)
}

function between(x, min, max) {
  return x >= min && max >= x
}

function last(arr = []) {
  return arr[arr.length - 1]
}

function first(arr = []) {
  return arr[0]
}

export class ElevatorController {
  constructor({ numOfElevators, maxFloor, moveTime } = {}) {
    this.elevators = []

    for(let id = 0; id < numOfElevators; id++) {
      this.elevators.push(new Elevator({ id, maxFloor, moveTime }))
    }
  }

  getNextElevator(target) {
    const priorities = this.elevators.map(elevator => ({
      id: elevator.id,
      priority: elevator.getPriority(target)
    })).filter(elevator => elevator.priority !== Infinity)

    // Ascending by priority
    priorities.sort((a, b) => compare(a.priority, b.priority))

    const winner = first(priorities)
    return this.elevators[winner.id]
  }

  call(target) {
    this.getNextElevator(target).call(target)
  }
}

export class Elevator {
  constructor({ id, maxFloor, moveTime = 1000, maintenanceTime = 5000 , tripsUntilMaintenance = 100} = {}) {
    this.id = id
    this.floor = 1
    this.targets = []
    this.direction = Direction.NONE
    this.maxFloor = maxFloor
    this.moveTime = moveTime
    this.floorsTravelled = 0
    this.trips = 0
    this.canMove = true
    this.maintenanceTime = maintenanceTime
    this.tripsUntilMaintenance = tripsUntilMaintenance
  }

  isAtTarget() {
    return this.floor === first(this.targets)
  }

  calculateDirection(target) {
    return compare(target, this.floor)
  }

  setMaintenance() {
    this.canMove = false
    console.log(`Elevator ${this.id} is in maintenance`)

    setTimeout(() => {
      console.log(`Elevator ${this.id} completed maintenance`)
      this.canMove = true
    }, this.maintenanceTime)
  }

  nextFloor() {
    this.floor += this.direction
    this.floorsTravelled++
  }

  hasQueuedTargets() {
    return this.targets.length
  }

  arriveAtTarget() {
    this.targets.shift()
    this.direction = this.calculateDirection(first(this.targets))
    console.log(`Elevator ${this.id} opening doors on floor ${this.floor}`)
    this.canMove = false

    return setTimeout(() => {
      console.log(`Elevator ${this.id} closing doors on floor ${this.floor}`)
      this.canMove = true
      this.move()
    }, this.moveTime)
  }

  move() {
    const nextFloor = this.floor + this.direction
    console.log(`Elevator ${this.id} moving to floor ${nextFloor}`)

    setTimeout(() => {
      this.nextFloor()

      if (this.isAtTarget()) {
        this.arriveAtTarget()
      }

      if (this.hasQueuedTargets()) {
        this.move()
      } else {
        this.trips++
        this.state = Direction.NONE
        if (this.trips >= this.tripsUntilMaintenance) {
          this.setMaintenance()
        }
      }
    }, this.moveTime)
  }

  getPriority(target) {
    if (!this.canMove) return Priority.NEVER
    if (this.floor === target) return Priority.HIGH
    const priority = this.isOnTheWay(target) ? Priority.AVERAGE : Priority.LOW
    return priority + diff(this.floor, target)
  }

  isWithinFloorRange(target) {
    return between(target, 1, this.maxFloor)
  }

  isOnTheWay(target) {
    return this.direction === Direction.NONE ||
      between(target, this.floor, last(this.targets))
  }

  call(target) {
    const canTravel = this.isOnTheWay(target) && this.isWithinFloorRange(target)

    if (canTravel) {
      this.targets.unshift(target)
      this.direction = this.calculateDirection(target)
      this.move()
    } else {
      console.log(`Elevator ${this.id} cannot travel to floor ${target}`)
    }

    return canTravel
  }
}

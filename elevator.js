const Direction = Object.freeze({
  DOWN: -1,
  NONE: 0,
  UP: 1
})

const Priority = Object.freeze({
  HIGH: 1,
  AVERAGE: 2,
  LOW: 3
})

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
    // Prioritize elevators by distance from target and current direction
    const priorities = this.elevators.map(elevator => elevator.getPriority(target))
    priorities.sort()
    return first(priorities)
  }

  call(target) {
    this.getNextElevator(target).call(target)
  }
}

export class Elevator {
  constructor({ id, maxFloor, moveTime = 1000 } = {}) {
    this.id = id
    this.floor = 1
    this.targets = []
    this.direction = Direction.NONE
    this.maxFloor = maxFloor
    this.moveTime = moveTime
  }

  move() {
    const nextFloor = this.floor + this.direction
    console.log(`Elevator ${this.id} moving to floor ${nextFloor}`)

    setTimeout(() => {
      this.floor = nextFloor

      if (this.floor === this.targets[0]) {
        this.targets.shift()
        console.log(`Elevator ${this.id} opening doors on floor ${this.floor}`)
      }

      if (this.targets.length) {
        this.move()
      }
    }, this.moveTime)
  }

  getPriority(target) {
    if (this.floor === target) return Priority.HIGH
    else if (this.isOnTheWay(target)) return Priority.AVERAGE
    else return Priority.LOW
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
      this.direction = Math.sign(target - this.floor)
      this.move()
    } else {
      console.log(`Elevator ${this.id} cannot travel to floor ${target}`)
    }

    return canTravel
  }
}

const Direction = Object.freeze({
  DOWN: -1,
  NONE: 0,
  UP: 1
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

    for(let i = 0; i < numOfElevators; i++) {
      this.elevators.push(new Elevator({ i, maxFloor, moveTime }))
    }
  }


  getNextElevator(target) {
    // Prioritize elevators by distance from target and current direction
    return first(this.elevators)
  }

  call(target) {
    this.getNextElevator(target).call(target)
  }
}

export class Elevator {
  constructor({ id, maxFloor, moveTime = 1000 } = {}) {
    this.id = id
    this.floor = 8
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

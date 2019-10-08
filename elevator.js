const Direction = Object.freeze({
  DOWN: -1,
  NONE: 0,
  UP: 1
})

function between(x, min, max) {
  return x >= min && max >= x
}

export class Elevator {
  constructor(id, maxFloor, moveTime = 1000) {
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
    if (this.isOnTheWay(target) && this.isWithinFloorRange(target)) {
      this.targets.unshift(target)
      this.direction = Math.sign(target - this.floor)
      this.move()
    } else {
      console.log(`Elevator ${this.id} cannot travel to floor ${target}`)
    }
  }
}

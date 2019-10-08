export class Elevator {
  constructor(id, maxFloor, moveTime = 1000) {
    this.id = id
    this.floor = 1
    this.targets = []
    this.maxFloor = maxFloor
    this.moveTime = moveTime
  }

  call(target) {
    console.log(`Elevator ${this.id} arrived at floor ${target}`)
    return true
  }
}

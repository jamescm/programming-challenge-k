import { ElevatorController } from './elevator.js'

const controller = new ElevatorController({ numOfElevators: 10, maxFloor: 10 })

controller.call(8)

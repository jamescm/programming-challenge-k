import { ElevatorController } from './elevator.js'

const controller = new ElevatorController({ numOfElevators: 10, maxFloor: 10 })

controller.call(8)

const sleep = t => new Promise(r => setTimeout(r, t))

sleep(3001).then(() => controller.call(3))
sleep(4001).then(() => controller.call(1))
sleep(8001).then(() => controller.call(6))

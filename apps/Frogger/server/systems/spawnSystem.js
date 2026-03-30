import { LANES, BUS_SPAWN_X } from '../../common/config.js'
import { Position, Velocity, BusData } from '../../common/components.js'

export function createSpawnSystem(ecs, sync) {
  const timers = LANES.map(() => 0)

  return function spawnSystem(delta) {
    for (let i = 0; i < LANES.length; i++) {
      timers[i] += delta
      if (timers[i] >= LANES[i].interval) {
        timers[i] = 0
        const lane = LANES[i]
        const spawnX = lane.direction > 0 ? -BUS_SPAWN_X : BUS_SPAWN_X
        const id = ecs.spawn([
          Position(spawnX, 0, lane.zCenter),
          Velocity(lane.direction * lane.speed, 0, 0),
          BusData(lane.road, i, lane.busLength, lane.direction),
        ])
        sync.onSpawn(id, {
          id,
          lane: i,
          x: spawnX,
          z: lane.zCenter,
          dir: lane.direction,
          speed: lane.speed,
          len: lane.busLength,
          road: lane.road,
        })
      }
    }
  }
}

import { BUS_DESPAWN_X } from '../../common/config.js'

export function createDespawnSystem(ecs, sync) {
  return function despawnSystem() {
    for (const [id, pos] of ecs.query('position', 'busData')) {
      if (Math.abs(pos.x) > BUS_DESPAWN_X) {
        sync.onDespawn(id)
        ecs.despawn(id)
      }
    }
  }
}

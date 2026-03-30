import { Position, Velocity, BusData, Renderable } from '../../common/components.js'
import { createBusVisual } from '../busVisual.js'

export function createRenderSystem(ecs, app) {
  const serverToLocal = new Map()

  function spawnBus(data) {
    const localId = ecs.spawn([
      Position(data.x, 0, data.z),
      Velocity(data.dir * data.speed, 0, 0),
      BusData(data.road, data.lane, data.len, data.dir),
      Renderable(),
    ])

    const node = createBusVisual(app, { road: data.road, len: data.len, dir: data.dir })
    node.position.set(data.x, 1.35, data.z)

    const renderable = ecs.get(localId, 'renderable')
    renderable.node = node
    app.add(node)

    serverToLocal.set(data.id, localId)
    return localId
  }

  function despawnBus(serverId) {
    const localId = serverToLocal.get(serverId)
    if (localId == null) return
    const renderable = ecs.get(localId, 'renderable')
    if (renderable?.node) app.remove(renderable.node)
    ecs.despawn(localId)
    serverToLocal.delete(serverId)
  }

  function syncPositions() {
    for (const [id, pos, , renderable] of ecs.query('position', 'velocity', 'renderable')) {
      if (renderable.node) {
        renderable.node.position.x = pos.x
      }
    }
  }

  return { spawnBus, despawnBus, syncPositions }
}

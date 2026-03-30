import { Position, Velocity, BusData, Renderable } from '../../common/components.js'
import { BUS_SYNC_SNAP_DISTANCE, BUS_SYNC_CORRECTION_RATE } from '../../common/config.js'
import { createBusVisual, BODY_Y } from '../busVisual.js'

export function createRenderSystem(ecs, app) {
  const serverToLocal = new Map()

  function normalizeSnapshot(snapshot) {
    if (!snapshot) return []
    return Array.isArray(snapshot) ? snapshot : Object.values(snapshot)
  }

  function updateLocalBus(localId, data) {
    const pos = ecs.get(localId, 'position')
    const vel = ecs.get(localId, 'velocity')
    const bus = ecs.get(localId, 'busData')
    const renderable = ecs.get(localId, 'renderable')

    if (vel) {
      vel.x = data.dir * data.speed
      vel.y = 0
      vel.z = 0
    }

    if (bus) {
      bus.road = data.road
      bus.lane = data.lane
      bus.len = data.len
      bus.dir = data.dir
    }

    if (pos) {
      const errorX = data.x - pos.x

      pos.y = 0
      pos.z = data.z

      if (Math.abs(errorX) >= BUS_SYNC_SNAP_DISTANCE) {
        pos.x = data.x
        if (renderable) renderable.syncOffsetX = 0
      } else if (renderable) {
        renderable.syncOffsetX = errorX
      }
    }

    if (renderable?.node) {
      renderable.node.position.y = BODY_Y
      renderable.node.position.z = data.z
      if (Math.abs((renderable.syncOffsetX ?? 0)) < 1e-6) {
        renderable.node.position.x = pos?.x ?? data.x
      }
    }
  }

  function spawnBus(data) {
    const existing = serverToLocal.get(data.id)
    if (existing != null) {
      updateLocalBus(existing, data)
      return existing
    }

    const localId = ecs.spawn([
      Position(data.x, 0, data.z),
      Velocity(data.dir * data.speed, 0, 0),
      BusData(data.road, data.lane, data.len, data.dir),
      Renderable(),
    ])

    const node = createBusVisual(app, { road: data.road, len: data.len, dir: data.dir })
    node.position.set(data.x, BODY_Y, data.z)
    app.add(node)

    const renderable = ecs.get(localId, 'renderable')
    renderable.node = node
    renderable.syncOffsetX = 0

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

  function reconcileBuses(snapshot) {
    const buses = normalizeSnapshot(snapshot)
    const activeServerIds = new Set()

    for (const data of buses) {
      activeServerIds.add(data.id)
      spawnBus(data)
    }

    for (const serverId of serverToLocal.keys()) {
      if (!activeServerIds.has(serverId)) {
        despawnBus(serverId)
      }
    }
  }

  function syncPositions(delta) {
    const alpha = Math.min(1, delta * BUS_SYNC_CORRECTION_RATE)

    for (const [id, pos, renderable] of ecs.query('position', 'renderable')) {
      if (renderable.syncOffsetX) {
        const correction = renderable.syncOffsetX * alpha
        pos.x += correction
        renderable.syncOffsetX -= correction
        if (Math.abs(renderable.syncOffsetX) < 1e-3) {
          renderable.syncOffsetX = 0
        }
      }

      if (renderable.node) {
        renderable.node.position.set(pos.x, BODY_Y, pos.z)
      }
    }
  }

  return { spawnBus, despawnBus, reconcileBuses, syncPositions }
}

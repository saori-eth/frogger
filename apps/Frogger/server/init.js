import { createWorld } from '../common/ecs.js'
import { movementSystem } from '../common/systems/movementSystem.js'
import { LANES, SPAWN_POINT, HIT_COOLDOWN, WIN_TELEPORT_DELAY, BUS_SYNC_INTERVAL } from '../common/config.js'
import { createSpawnSystem } from './systems/spawnSystem.js'
import { createDespawnSystem } from './systems/despawnSystem.js'
import { createSync } from './sync.js'

export function initServer(app, world, setTimeout) {
  const ecs = createWorld()
  const sync = createSync(app)
  const spawnSystem = createSpawnSystem(ecs, sync)
  const despawnSystem = createDespawnSystem(ecs, sync)
  const spawn = new Vector3(SPAWN_POINT[0], SPAWN_POINT[1], SPAWN_POINT[2])

  const hitCooldowns = {}
  let syncTimer = 0

  const RAGDOLL_DURATION = 3

  app.on('hit', ({ playerId, dir }) => {
    const now = Date.now()
    if (hitCooldowns[playerId] && now - hitCooldowns[playerId] < HIT_COOLDOWN * 1000) return
    const player = world.getPlayer(playerId)
    if (!player) return
    hitCooldowns[playerId] = now
    player.ragdoll(true, new Vector3((dir || 1) * 8, 10, 0), {
      stiffness: 0.3,
      duration: RAGDOLL_DURATION,
    })
    app.send('playerHit', { playerId, name: player.name })
    setTimeout(() => {
      const p = world.getPlayer(playerId)
      if (p) {
        p.ragdoll(false)
        p.teleport(spawn, Math.PI)
      }
    }, RAGDOLL_DURATION * 1000)
  })

  app.on('playerWin', ({ playerId }) => {
    const player = world.getPlayer(playerId)
    if (!player) return
    app.send('playerWon', { playerId, name: player.name })
    setTimeout(() => {
      const p = world.getPlayer(playerId)
      if (p) p.teleport(spawn, 0)
    }, WIN_TELEPORT_DELAY)
  })

  app.on('fixedUpdate', (delta) => {
    spawnSystem(delta)
    movementSystem(ecs, delta)
    despawnSystem()
    sync.updatePositions(ecs)

    syncTimer += delta
    if (syncTimer >= BUS_SYNC_INTERVAL) {
      syncTimer %= BUS_SYNC_INTERVAL
      sync.broadcastSnapshot()
    }
  })

  app.state.ready = true
  app.state.buses = sync.getBuses()
  app.state.laneConfigs = LANES
  app.send('init', app.state)
}

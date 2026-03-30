import { createWorld } from '../common/ecs.js'
import { movementSystem } from '../common/systems/movementSystem.js'
import { LANES, SPAWN_POINT, HIT_COOLDOWN, WIN_TELEPORT_DELAY } from '../common/config.js'
import { createSpawnSystem } from './systems/spawnSystem.js'
import { createDespawnSystem } from './systems/despawnSystem.js'
import { createSync } from './sync.js'

export function initServer(app, world, setTimeout) {
  const ecs = createWorld()
  const sync = createSync(app)
  const spawnSystem = createSpawnSystem(ecs, sync)
  const despawnSystem = createDespawnSystem(ecs, sync)

  const hitCooldowns = {}

  app.on('hit', ({ playerId }) => {
    const now = Date.now()
    if (hitCooldowns[playerId] && now - hitCooldowns[playerId] < HIT_COOLDOWN * 1000) return
    const player = world.getPlayer(playerId)
    if (!player) return
    hitCooldowns[playerId] = now
    player.teleport(SPAWN_POINT, 0)
    app.send('playerHit', { playerId })
  })

  app.on('playerWin', ({ playerId }) => {
    const player = world.getPlayer(playerId)
    if (!player) return
    app.send('playerWon', { playerId, name: player.name })
    setTimeout(() => {
      const p = world.getPlayer(playerId)
      if (p) p.teleport(SPAWN_POINT, 0)
    }, WIN_TELEPORT_DELAY)
  })

  app.on('fixedUpdate', (delta) => {
    spawnSystem(delta)
    movementSystem(ecs, delta)
    despawnSystem()
    sync.updatePositions(ecs)
  })

  app.state.ready = true
  app.state.buses = sync.getBuses()
  app.state.laneConfigs = LANES
  app.send('init', app.state)
}

import { createWorld } from '../common/ecs.js'
import { movementSystem } from '../common/systems/movementSystem.js'
import { buildLayout } from './layout.js'
import { createRenderSystem } from './systems/renderSystem.js'
import { createCollisionSystem } from './systems/collisionSystem.js'
import { createInputSystem } from './systems/inputSystem.js'
import { createHud } from './hud.js'

export function initClient(app, world, setTimeout) {
  const ecs = createWorld()

  function init(state) {
    // Build static world geometry
    buildLayout(app)

    // Set up systems
    const input = createInputSystem(app)
    const renderSystem = createRenderSystem(ecs, app)
    const collisionSystem = createCollisionSystem(app, world, ecs)
    const hud = createHud(app, setTimeout)

    // Hydrate existing buses from server state
    if (state.buses) {
      const busEntries = typeof state.buses === 'object' ? Object.values(state.buses) : []
      for (const busData of busEntries) {
        renderSystem.spawnBus(busData)
      }
    }

    // Listen for new bus spawns
    app.on('busSpawn', (data) => {
      renderSystem.spawnBus(data)
    })

    // Listen for bus despawns
    app.on('busDespawn', ({ id }) => {
      renderSystem.despawnBus(id)
    })

    // Listen for player hit (visual feedback)
    app.on('playerHit', ({ playerId }) => {
      hud.showHitFlash()
    })

    // Listen for player win
    app.on('playerWon', ({ playerId, name }) => {
      hud.showWinMessage(name)
    })

    // Client update loop
    app.on('update', (delta) => {
      movementSystem(ecs, delta)
      renderSystem.syncPositions()
      collisionSystem.update(delta)
    })
  }

  // Handle init timing (server may not be ready yet)
  if (app.state.ready) {
    init(app.state)
  } else {
    app.on('init', init)
  }
}

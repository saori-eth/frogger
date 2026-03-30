import { createWorld } from '../common/ecs.js'
import { movementSystem } from '../common/systems/movementSystem.js'
import { ZONES, FIELD_WIDTH, SPAWN_POINT, FLOOR_THICKNESS } from '../common/config.js'
import { buildLayout } from './layout.js'
import { createRenderSystem } from './systems/renderSystem.js'
import { createInputSystem } from './systems/inputSystem.js'
import { createHud } from './hud.js'

export function initClient(app, world, setTimeout) {
  const ecs = createWorld()

  function init(state) {
    buildLayout(app)

    const input = createInputSystem(app)
    const renderSystem = createRenderSystem(ecs, app)
    const hud = createHud(app, setTimeout)

    // Finish zone trigger (client-side)
    const fz = ZONES.finish
    app.add(app.create('prim', {
      type: 'box',
      size: [FIELD_WIDTH, 4, fz.z1 - fz.z0],
      position: [0, 2, (fz.z0 + fz.z1) / 2],
      opacity: 0,
      physics: 'static',
      trigger: true,
      onTriggerEnter: (e) => {
        if (!e.isLocalPlayer) return
        app.send('playerWin', { playerId: e.playerId })
      },
    }))

    // Hydrate existing buses
    if (state.buses) {
      renderSystem.reconcileBuses(state.buses)
    }

    app.on('busSpawn', (data) => renderSystem.spawnBus(data))
    app.on('busDespawn', ({ id }) => renderSystem.despawnBus(id))
    app.on('busSync', (snapshot) => renderSystem.reconcileBuses(snapshot))
    app.on('playerHit', ({ playerId, name }) => {
      const local = world.getPlayer()
      const isLocal = local && local.id === playerId
      if (isLocal) {
        world.setReticle({ opacity: 0, layers: [{ shape: 'dot', radius: 0.5, opacity: 0 }] })
        setTimeout(() => world.setReticle(null), 3000)
      }
      hud.showHitFlash(isLocal, name)
    })
    app.on('playerWon', ({ name }) => hud.showWinMessage(name))

    app.on('update', (delta) => {
      movementSystem(ecs, delta)
      renderSystem.syncPositions(delta)
    })
  }

  if (app.state.ready) {
    init(app.state)
  } else {
    app.on('init', init)
  }
}

import { createWorld } from '../common/ecs.js'
import { movementSystem } from '../common/systems/movementSystem.js'
import { ZONES, FIELD_WIDTH, SPAWN_POINT, FLOOR_THICKNESS } from '../common/config.js'
import { buildLayout } from './layout.js'
import { createRenderSystem } from './systems/renderSystem.js'
import { createInputSystem } from './systems/inputSystem.js'
import { createHud } from './hud.js'

const spawn = new Vector3(SPAWN_POINT[0], SPAWN_POINT[1], SPAWN_POINT[2])
const holdingPos = new Vector3(0, 0.5, -200)

export function initClient(app, world, setTimeout) {
  const ecs = createWorld()

  function init(state) {
    // --- Phase 1: Pre-load ---
    const player = world.getPlayer()
    const input = createInputSystem(app)

    // Holding platform far behind the game area
    const holdingPlatform = app.create('prim', {
      type: 'box',
      size: [6, FLOOR_THICKNESS, 6],
      position: [0, -FLOOR_THICKNESS / 2, -200],
      color: '#000000',
      physics: 'static',
    })
    app.add(holdingPlatform)

    if (player) {
      player.teleport(holdingPos, Math.PI)
      input.camera.write = true
      input.camera.position.set(0, 5, -208)
      input.camera.quaternion.set(0, 0, 0, 1)
      world.setReticle({ opacity: 0, layers: [{ shape: 'dot', radius: 0.5, opacity: 0 }] })
    }

    // Loading overlay
    const loadingOverlay = app.create('ui', {
      space: 'screen',
      pivot: 'center',
      position: [0.5, 0.5, 0],
      width: 4000,
      height: 4000,
      backgroundColor: 'rgba(0,0,0,0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: false,
    })
    const loadingText = app.create('uitext', {
      value: 'LOADING...',
      fontSize: 32,
      color: '#00FF00',
      fontWeight: 'bold',
      textAlign: 'center',
    })
    loadingOverlay.add(loadingText)
    app.add(loadingOverlay)

    // --- Phase 2: Build the world ---
    buildLayout(app)

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

    // --- Phase 3: Spawn after delay ---
    setTimeout(() => {
      if (player) {
        player.teleport(spawn, Math.PI)
        input.camera.write = false
        world.setReticle(null)
      }
      app.remove(loadingOverlay)
      app.remove(holdingPlatform)
    }, 1500)

    // --- Event subscriptions ---
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

import { COLORS } from '../common/config.js'

export function createBusVisual(app, busData) {
  const { road, len, dir } = busData

  const bodyColor = COLORS.bus[road]
  const roofColor = COLORS.busRoof[road]
  const busWidth = 2.2
  const bodyHeight = 2.5
  const bodyY = bodyHeight / 2 // body center Y offset from ground

  // Body is the root node — physics trigger tracks its position directly
  const body = app.create('prim', {
    type: 'box',
    size: [len, bodyHeight, busWidth],
    color: bodyColor,
    physics: 'kinematic',
    trigger: true,
    layer: 'prop',
    onTriggerEnter: (e) => {
      console.log('hit', e)
      if (!e.playerId || !e.isLocalPlayer) return
      console.log('sending hit', e)
      app.send('hit', { playerId: e.playerId })
    },
  })

  // All children positioned relative to body center (0, 0, 0)
  const roof = app.create('prim', {
    type: 'box',
    size: [len - 0.2, 0.3, busWidth - 0.2],
    position: [0, bodyY + 0.15, 0],
    color: roofColor,
  })
  body.add(roof)

  // Windows
  const windowSpacing = 1.5
  const windowCount = Math.floor((len - 1) / windowSpacing)
  const startX = -(windowCount - 1) * windowSpacing / 2
  for (let i = 0; i < windowCount; i++) {
    const wx = startX + i * windowSpacing
    for (const zSide of [busWidth / 2 + 0.01, -(busWidth / 2 + 0.01)]) {
      const win = app.create('prim', {
        type: 'box',
        size: [0.8, 0.6, 0.05],
        position: [wx, 0.4, zSide],
        color: COLORS.window,
      })
      body.add(win)
    }
  }

  // Wheels
  const wheelRadius = 0.35
  const wheelWidth = 0.25
  const wheelOffsetX = len / 2 - 0.8
  const wheelOffsetZ = busWidth / 2 - 0.1
  for (const [wx, wz] of [[wheelOffsetX, wheelOffsetZ], [wheelOffsetX, -wheelOffsetZ], [-wheelOffsetX, wheelOffsetZ], [-wheelOffsetX, -wheelOffsetZ]]) {
    const wheel = app.create('prim', {
      type: 'cylinder',
      size: [wheelRadius, wheelRadius, wheelWidth],
      position: [wx, wheelRadius - bodyY, wz],
      rotation: [Math.PI / 2, 0, 0],
      color: COLORS.wheel,
    })
    body.add(wheel)
  }

  // Headlights on hard road
  if (road === 2) {
    const frontX = dir > 0 ? len / 2 + 0.01 : -(len / 2 + 0.01)
    for (const hz of [0.5, -0.5]) {
      const light = app.create('prim', {
        type: 'box',
        size: [0.05, 0.2, 0.3],
        position: [frontX, -0.3, hz],
        color: COLORS.headlight,
        emissive: COLORS.headlight,
        emissiveIntensity: 4,
      })
      body.add(light)
    }
  }

  if (dir < 0) {
    body.rotation.y = Math.PI
  }

  return body
}

import { COLORS } from '../common/config.js'

export function createBusVisual(app, busData) {
  const { road, len, dir } = busData
  const group = app.create('group')

  const bodyColor = COLORS.bus[road]
  const roofColor = COLORS.busRoof[road]
  const busWidth = 2.2
  const bodyHeight = 2.5

  // Body
  const body = app.create('prim', {
    type: 'box',
    size: [len, bodyHeight, busWidth],
    position: [0, bodyHeight / 2, 0],
    color: bodyColor,
  })
  group.add(body)

  // Roof
  const roof = app.create('prim', {
    type: 'box',
    size: [len - 0.2, 0.3, busWidth - 0.2],
    position: [0, bodyHeight + 0.15, 0],
    color: roofColor,
  })
  group.add(roof)

  // Windows (along both sides)
  const windowSpacing = 1.5
  const windowCount = Math.floor((len - 1) / windowSpacing)
  const startX = -(windowCount - 1) * windowSpacing / 2
  for (let i = 0; i < windowCount; i++) {
    const wx = startX + i * windowSpacing
    for (const zSide of [busWidth / 2 + 0.01, -(busWidth / 2 + 0.01)]) {
      const win = app.create('prim', {
        type: 'box',
        size: [0.8, 0.6, 0.05],
        position: [wx, bodyHeight / 2 + 0.4, zSide],
        color: COLORS.window,
      })
      group.add(win)
    }
  }

  // Wheels (4 corners)
  const wheelRadius = 0.35
  const wheelWidth = 0.25
  const wheelOffsetX = len / 2 - 0.8
  const wheelOffsetZ = busWidth / 2 - 0.1
  const wheelPositions = [
    [wheelOffsetX, wheelRadius, wheelOffsetZ],
    [wheelOffsetX, wheelRadius, -wheelOffsetZ],
    [-wheelOffsetX, wheelRadius, wheelOffsetZ],
    [-wheelOffsetX, wheelRadius, -wheelOffsetZ],
  ]
  for (const [wx, wy, wz] of wheelPositions) {
    const wheel = app.create('prim', {
      type: 'cylinder',
      size: [wheelRadius, wheelRadius, wheelWidth],
      position: [wx, wy, wz],
      rotation: [Math.PI / 2, 0, 0],
      color: COLORS.wheel,
    })
    group.add(wheel)
  }

  // Headlights on hard road (road 3 = index 2)
  if (road === 2) {
    const frontX = dir > 0 ? len / 2 + 0.01 : -(len / 2 + 0.01)
    for (const hz of [0.5, -0.5]) {
      const light = app.create('prim', {
        type: 'box',
        size: [0.05, 0.2, 0.3],
        position: [frontX, bodyHeight / 2 - 0.3, hz],
        color: COLORS.headlight,
        emissive: COLORS.headlight,
        emissiveIntensity: 4,
      })
      group.add(light)
    }
  }

  // Rotate bus to face travel direction
  if (dir < 0) {
    group.rotation.y = Math.PI
  }

  return group
}

import { COLORS } from '../common/config.js'

export const WHEEL_RADIUS = 0.5
export const BODY_HEIGHT = 2.15
export const BODY_Y = WHEEL_RADIUS + BODY_HEIGHT / 2

export function createBusVisual(app, busData) {
  const { road, len, dir } = busData

  const bodyColor = COLORS.bus[road]
  const roofColor = COLORS.busRoof[road]
  const busWidth = 2.6
  const halfBody = BODY_HEIGHT / 2

  // Rigidbody root — kinematic, moves by code
  const rb = app.create('rigidbody', {
    type: 'kinematic',
    onTriggerEnter: (e) => {
      if (!e.playerId || !e.isLocalPlayer) return
      console.log('sending hit', e)
      app.send('hit', { playerId: e.playerId, dir })
    },
  })

  // Solid collider — pushes the player
  const solid = app.create('collider', { type: 'box' })
  solid.setSize(len, BODY_HEIGHT, busWidth)
  rb.add(solid)

  // Trigger collider — slightly larger so player enters trigger before solid pushes
  const trig = app.create('collider', { type: 'box', trigger: true })
  trig.setSize(len + 0.4, BODY_HEIGHT + 0.4, busWidth + 0.4)
  rb.add(trig)

  // Visual body
  const bodyOpts = {
    type: 'box',
    size: [len, BODY_HEIGHT, busWidth],
    color: bodyColor,
  }
  // Road 2 buses get a menacing glow
  if (road === 2) {
    bodyOpts.emissive = '#330000'
    bodyOpts.emissiveIntensity = 0.5
  }
  rb.add(app.create('prim', bodyOpts))

  // Roof
  rb.add(app.create('prim', {
    type: 'box',
    size: [len - 0.2, 0.3, busWidth - 0.2],
    position: [0, halfBody + 0.15, 0],
    color: roofColor,
  }))

  // Windows
  const windowSpacing = 1.5
  const windowCount = Math.floor((len - 1) / windowSpacing)
  const startX = -(windowCount - 1) * windowSpacing / 2
  for (let i = 0; i < windowCount; i++) {
    const wx = startX + i * windowSpacing
    for (const zSide of [busWidth / 2 + 0.01, -(busWidth / 2 + 0.01)]) {
      rb.add(app.create('prim', {
        type: 'box',
        size: [0.8, 0.6, 0.05],
        position: [wx, 0.3, zSide],
        color: COLORS.window,
      }))
    }
  }

  // Wheels
  const wheelWidth = 0.25
  const wheelOffsetX = len / 2 - 0.8
  const wheelOffsetZ = busWidth / 2 - 0.1
  const wheelY = -(halfBody + WHEEL_RADIUS / 2)
  for (const [wx, wz] of [[wheelOffsetX, wheelOffsetZ], [wheelOffsetX, -wheelOffsetZ], [-wheelOffsetX, wheelOffsetZ], [-wheelOffsetX, -wheelOffsetZ]]) {
    rb.add(app.create('prim', {
      type: 'cylinder',
      size: [WHEEL_RADIUS, WHEEL_RADIUS, wheelWidth],
      position: [wx, wheelY, wz],
      rotation: [Math.PI / 2, 0, 0],
      color: COLORS.wheel,
    }))
  }

  // Headlights — all roads, escalating intensity
  const headlightIntensity = [0.8, 1.0, 1.5]
  const frontX = dir > 0 ? len / 2 + 0.01 : -(len / 2 + 0.01)
  for (const hz of [0.5, -0.5]) {
    rb.add(app.create('prim', {
      type: 'box',
      size: [0.05, 0.2, 0.3],
      position: [frontX, -0.3, hz],
      color: COLORS.headlight,
      emissive: COLORS.headlight,
      emissiveIntensity: headlightIntensity[road],
    }))
  }

  // Taillights — red glow on the rear
  const rearX = dir > 0 ? -(len / 2 + 0.01) : (len / 2 + 0.01)
  for (const tz of [0.5, -0.5]) {
    rb.add(app.create('prim', {
      type: 'box',
      size: [0.05, 0.15, 0.25],
      position: [rearX, -0.3, tz],
      color: COLORS.taillight,
      emissive: COLORS.taillight,
      emissiveIntensity: 1.5,
    }))
  }

  if (dir < 0) {
    rb.rotation.y = Math.PI
  }

  return rb
}

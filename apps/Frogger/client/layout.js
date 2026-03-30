import {
  FIELD_WIDTH, HALF_WIDTH, ZONES, FLOOR_THICKNESS,
  CURB_HEIGHT, TUNNEL_X, TUNNEL_DEPTH, TUNNEL_HEIGHT,
  LANE_DEPTH, LANE_GAP, COLORS
} from '../common/config.js'
import { buildDecorations } from './decorations.js'

function floorSlab(app, z0, z1, color, group, opts = {}) {
  const depth = z1 - z0
  const zCenter = (z0 + z1) / 2
  const yOffset = opts.recess || 0
  const prim = {
    type: 'box',
    size: [FIELD_WIDTH, FLOOR_THICKNESS, depth],
    position: [0, -FLOOR_THICKNESS / 2 - yOffset, zCenter],
    color,
  }
  if (opts.physics !== false) prim.physics = 'static'
  if (opts.emissive) {
    prim.emissive = opts.emissive
    prim.emissiveIntensity = opts.emissiveIntensity || 1
  }
  group.add(app.create('prim', prim))
}

function curb(app, z0, z1, roadIdx, group) {
  const depth = z1 - z0
  const zCenter = (z0 + z1) / 2

  // Base curb
  group.add(app.create('prim', {
    type: 'box',
    size: [FIELD_WIDTH, CURB_HEIGHT, depth],
    position: [0, CURB_HEIGHT / 2, zCenter],
    color: COLORS.curb,
    physics: 'static',
  }))

  // Warning stripe on top — escalates with road difficulty
  const stripeColors = ['#FFC107', '#FF9800', '#F44336']
  const stripeIntensity = [0.4, 0.7, 1.2]
  const ci = Math.min(roadIdx, 2)
  group.add(app.create('prim', {
    type: 'box',
    size: [FIELD_WIDTH, 0.05, depth * 0.6],
    position: [0, CURB_HEIGHT + 0.026, zCenter],
    color: stripeColors[ci],
    emissive: stripeColors[ci],
    emissiveIntensity: stripeIntensity[ci],
  }))
}

function tunnel(app, z0, z1, side, group) {
  const depth = z1 - z0
  const zCenter = (z0 + z1) / 2
  const xSign = side === 'left' ? -1 : 1
  const xPos = xSign * TUNNEL_X

  // Outer wall (no physics — buses pass through)
  group.add(app.create('prim', {
    type: 'box',
    size: [TUNNEL_DEPTH, TUNNEL_HEIGHT, depth],
    position: [xPos, TUNNEL_HEIGHT / 2, zCenter],
    color: COLORS.tunnel,
  }))

  // Roof over the opening — extends inward
  group.add(app.create('prim', {
    type: 'box',
    size: [TUNNEL_DEPTH + 2, 0.4, depth],
    position: [xPos, TUNNEL_HEIGHT, zCenter],
    color: COLORS.tunnel,
  }))

  // Dark inner face
  group.add(app.create('prim', {
    type: 'box',
    size: [0.1, TUNNEL_HEIGHT, depth],
    position: [xPos + xSign * (TUNNEL_DEPTH / 2 + 0.05), TUNNEL_HEIGHT / 2, zCenter],
    color: COLORS.tunnelInner,
  }))

  // Warning lights at tunnel mouth
  const innerEdgeX = xPos - xSign * (TUNNEL_DEPTH / 2)
  for (const zOff of [-depth / 4, depth / 4]) {
    group.add(app.create('prim', {
      type: 'sphere',
      size: [0.4],
      position: [innerEdgeX, TUNNEL_HEIGHT - 0.5, zCenter + zOff],
      color: COLORS.warningLight,
      emissive: COLORS.warningLight,
      emissiveIntensity: 1.5,
    }))
  }
}

function laneMarkings(app, roadZ0, laneCount, group) {
  for (let i = 1; i < laneCount; i++) {
    const z = roadZ0 + i * (LANE_DEPTH + LANE_GAP)
    for (let x = -HALF_WIDTH + 1.5; x < HALF_WIDTH; x += 3.5) {
      group.add(app.create('prim', {
        type: 'box',
        size: [1.5, 0.03, 0.4],
        position: [x, 0.02, z],
        color: COLORS.laneMarking,
        emissive: COLORS.laneMarking,
        emissiveIntensity: 0.3,
      }))
    }
  }
}

export function buildLayout(app) {
  const root = app.create('group')

  // Start zone
  floorSlab(app, ZONES.start.z0, ZONES.start.z1, COLORS.grass, root)

  // Safe zones
  floorSlab(app, ZONES.safe1.z0, ZONES.safe1.z1, COLORS.grassLight, root)
  floorSlab(app, ZONES.safe2.z0, ZONES.safe2.z1, COLORS.grassLight, root)

  // Finish zone — glowing gold
  floorSlab(app, ZONES.finish.z0, ZONES.finish.z1, COLORS.finish, root, {
    emissive: COLORS.finish,
    emissiveIntensity: 1.5,
  })

  // Roads — recessed below terrain
  const roads = [ZONES.road1, ZONES.road2, ZONES.road3]
  for (const road of roads) {
    floorSlab(app, road.z0, road.z1, COLORS.road, root, { recess: 0.15 })
    laneMarkings(app, road.z0, 3, root)
    tunnel(app, road.z0, road.z1, 'left', root)
    tunnel(app, road.z0, road.z1, 'right', root)
  }

  // Curbs — with escalating warning stripes
  const curbPairs = [
    [ZONES.curb1a, 0], [ZONES.curb1b, 0],
    [ZONES.curb2a, 1], [ZONES.curb2b, 1],
    [ZONES.curb3a, 2], [ZONES.curb3b, 2],
  ]
  for (const [c, ri] of curbPairs) {
    curb(app, c.z0, c.z1, ri, root)
  }

  // Environmental decorations
  buildDecorations(app, root)

  app.add(root)
  return root
}

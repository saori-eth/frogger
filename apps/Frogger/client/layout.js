import {
  FIELD_WIDTH, HALF_WIDTH, ZONES, FLOOR_THICKNESS,
  CURB_HEIGHT, TUNNEL_X, TUNNEL_DEPTH, TUNNEL_HEIGHT,
  LANE_DEPTH, LANE_GAP, COLORS
} from '../common/config.js'

function floorSlab(app, z0, z1, color, group, hasPhysics = true) {
  const depth = z1 - z0
  const zCenter = (z0 + z1) / 2
  const opts = {
    type: 'box',
    size: [FIELD_WIDTH, FLOOR_THICKNESS, depth],
    position: [0, -FLOOR_THICKNESS / 2, zCenter],
    color,
  }
  if (hasPhysics) opts.physics = 'static'
  group.add(app.create('prim', opts))
}

function curb(app, z0, z1, group) {
  const depth = z1 - z0
  const zCenter = (z0 + z1) / 2
  const slab = app.create('prim', {
    type: 'box',
    size: [FIELD_WIDTH, CURB_HEIGHT, depth],
    position: [0, CURB_HEIGHT / 2, zCenter],
    color: COLORS.curb,
    physics: 'static',
  })
  group.add(slab)
}

function tunnel(app, z0, z1, side, group) {
  const depth = z1 - z0
  const zCenter = (z0 + z1) / 2
  const xSign = side === 'left' ? -1 : 1
  const xPos = xSign * TUNNEL_X

  // Outer wall (no physics — buses pass through)
  const wall = app.create('prim', {
    type: 'box',
    size: [TUNNEL_DEPTH, TUNNEL_HEIGHT, depth],
    position: [xPos, TUNNEL_HEIGHT / 2, zCenter],
    color: COLORS.tunnel,
  })
  group.add(wall)

  // Roof over the opening
  const roof = app.create('prim', {
    type: 'box',
    size: [TUNNEL_DEPTH + 1, 0.3, depth],
    position: [xPos, TUNNEL_HEIGHT, zCenter],
    color: COLORS.tunnel,
  })
  group.add(roof)

  // Dark inner face
  const inner = app.create('prim', {
    type: 'box',
    size: [0.1, TUNNEL_HEIGHT, depth],
    position: [xPos + xSign * (TUNNEL_DEPTH / 2 + 0.05), TUNNEL_HEIGHT / 2, zCenter],
    color: COLORS.tunnelInner,
  })
  group.add(inner)
}

function laneMarkings(app, roadZ0, laneCount, group) {
  for (let i = 1; i < laneCount; i++) {
    const z = roadZ0 + i * (LANE_DEPTH + LANE_GAP)
    for (let x = -HALF_WIDTH + 1; x < HALF_WIDTH; x += 2) {
      const dash = app.create('prim', {
        type: 'box',
        size: [1, 0.02, 0.3],
        position: [x, 0.01, z],
        color: COLORS.laneMarking,
      })
      group.add(dash)
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

  // Finish zone
  const finZ = ZONES.finish
  const finDepth = finZ.z1 - finZ.z0
  const finCenter = (finZ.z0 + finZ.z1) / 2
  const finSlab = app.create('prim', {
    type: 'box',
    size: [FIELD_WIDTH, FLOOR_THICKNESS, finDepth],
    position: [0, -FLOOR_THICKNESS / 2, finCenter],
    color: COLORS.finish,
    emissive: COLORS.finish,
    emissiveIntensity: 2,
    physics: 'static',
  })
  root.add(finSlab)

  // Roads
  const roads = [ZONES.road1, ZONES.road2, ZONES.road3]
  for (const road of roads) {
    floorSlab(app, road.z0, road.z1, COLORS.road, root, false)
    laneMarkings(app, road.z0, 3, root)
    tunnel(app, road.z0, road.z1, 'left', root)
    tunnel(app, road.z0, road.z1, 'right', root)
  }

  // Curbs
  const curbs = [ZONES.curb1a, ZONES.curb1b, ZONES.curb2a, ZONES.curb2b, ZONES.curb3a, ZONES.curb3b]
  for (const c of curbs) {
    curb(app, c.z0, c.z1, root)
  }

  app.add(root)
  return root
}

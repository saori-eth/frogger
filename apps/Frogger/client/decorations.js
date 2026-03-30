import {
  FIELD_WIDTH, HALF_WIDTH, ZONES, CURB_HEIGHT, COLORS
} from '../common/config.js'

// --- Start Zone: Grand Plaza ---

function buildStartPlaza(app, group) {
  const archZ = ZONES.start.z1 - 1

  // Pillars
  for (const xSide of [-7, 7]) {
    group.add(app.create('prim', {
      type: 'box',
      size: [2, 6, 1],
      position: [xSide, 3, archZ],
      color: COLORS.pillar,
    }))
  }

  // Crossbeam
  group.add(app.create('prim', {
    type: 'box',
    size: [16, 1.5, 1],
    position: [0, 6.75, archZ],
    color: '#455A64',
  }))

  // Green glow strip under crossbeam
  group.add(app.create('prim', {
    type: 'box',
    size: [14, 0.2, 1.1],
    position: [0, 5.9, archZ],
    color: '#00E676',
    emissive: '#00E676',
    emissiveIntensity: 1.5,
  }))

  // Sign plate on top
  group.add(app.create('prim', {
    type: 'box',
    size: [8, 1, 0.2],
    position: [0, 7.8, archZ],
    color: '#1A1A1A',
  }))

  // Corner pillars with glow tops
  const cz = [1.5, archZ - 0.5]
  for (const x of [-16, 16]) {
    for (const z of cz) {
      group.add(app.create('prim', {
        type: 'box',
        size: [1, 2, 1],
        position: [x, 1, z],
        color: COLORS.pillar,
      }))
      group.add(app.create('prim', {
        type: 'sphere',
        size: [0.5],
        position: [x, 2.3, z],
        color: '#00E676',
        emissive: '#00E676',
        emissiveIntensity: 1.5,
      }))
    }
  }

  // Blocky trees flanking the start area
  const treePositions = [[-13, 2], [-13, 6], [13, 2], [13, 6]]
  for (const [tx, tz] of treePositions) {
    group.add(app.create('prim', {
      type: 'cylinder',
      size: [0.4, 0.4, 2.5],
      position: [tx, 1.25, tz],
      color: '#5D4037',
    }))
    group.add(app.create('prim', {
      type: 'box',
      size: [2.5, 2.5, 2.5],
      position: [tx, 3.75, tz],
      color: '#2E7D32',
    }))
  }
}

// --- Safe Zone Parks ---

function buildSafeZonePark(app, group, z0, z1) {
  const zCenter = (z0 + z1) / 2

  // Trees — varied sizes, staggered
  const trees = [
    { x: -15, z: zCenter - 2, trunk: 3,   canopy: 3,   trunkR: 0.5 },
    { x: -8,  z: zCenter + 1, trunk: 2,   canopy: 2,   trunkR: 0.35 },
    { x: 0,   z: zCenter - 1, trunk: 2.5, canopy: 2.5, trunkR: 0.4 },
    { x: 8,   z: zCenter + 2, trunk: 2,   canopy: 2,   trunkR: 0.35 },
    { x: 15,  z: zCenter - 1, trunk: 3,   canopy: 3,   trunkR: 0.5 },
  ]
  for (const t of trees) {
    group.add(app.create('prim', {
      type: 'cylinder',
      size: [t.trunkR, t.trunkR, t.trunk],
      position: [t.x, t.trunk / 2, t.z],
      color: '#5D4037',
    }))
    group.add(app.create('prim', {
      type: 'box',
      size: [t.canopy, t.canopy, t.canopy],
      position: [t.x, t.trunk + t.canopy / 2, t.z],
      color: '#2E7D32',
    }))
  }

  // Lamp posts
  const lampXs = [-14, -5, 5, 14]
  for (const lx of lampXs) {
    group.add(app.create('prim', {
      type: 'cylinder',
      size: [0.15, 0.15, 4],
      position: [lx, 2, zCenter],
      color: COLORS.lampPost,
    }))
    group.add(app.create('prim', {
      type: 'sphere',
      size: [0.5],
      position: [lx, 4.3, zCenter],
      color: '#FFECB3',
      emissive: COLORS.lampGlow,
      emissiveIntensity: 1.5,
    }))
  }

  // Benches
  for (const bx of [-4, 4]) {
    const bz = zCenter + 2.5
    group.add(app.create('prim', {
      type: 'box',
      size: [2, 0.15, 0.8],
      position: [bx, 0.6, bz],
      color: '#5D4037',
    }))
    for (const legX of [-0.8, 0.8]) {
      group.add(app.create('prim', {
        type: 'box',
        size: [0.2, 0.6, 0.8],
        position: [bx + legX, 0.3, bz],
        color: '#3E2723',
      }))
    }
  }

  // Hedges at zone edges
  for (const hz of [z0 + 0.5, z1 - 0.5]) {
    group.add(app.create('prim', {
      type: 'box',
      size: [FIELD_WIDTH - 6, 0.6, 0.5],
      position: [0, 0.3, hz],
      color: '#388E3C',
    }))
  }
}

// --- Finish Zone: Victory Hall ---

function buildFinishHall(app, group) {
  const fz = ZONES.finish
  const fzCenter = (fz.z0 + fz.z1) / 2

  // Grand victory arch
  for (const xSide of [-9, 9]) {
    group.add(app.create('prim', {
      type: 'box',
      size: [2.5, 8, 2],
      position: [xSide, 4, fzCenter],
      color: COLORS.darkGold,
    }))
  }

  // Crossbeam
  group.add(app.create('prim', {
    type: 'box',
    size: [21, 2, 2],
    position: [0, 9, fzCenter],
    color: '#DAA520',
  }))

  // Crown on top
  group.add(app.create('prim', {
    type: 'box',
    size: [23, 0.5, 2.5],
    position: [0, 10.5, fzCenter],
    color: COLORS.gold,
    emissive: COLORS.gold,
    emissiveIntensity: 1.5,
  }))

  // Glow strip under crossbeam
  group.add(app.create('prim', {
    type: 'box',
    size: [18, 0.3, 0.3],
    position: [0, 7.8, fzCenter - 1],
    color: COLORS.gold,
    emissive: COLORS.gold,
    emissiveIntensity: 1.5,
  }))

  // Victory columns with gold glow tops
  const colZs = [fz.z0 + 1, fzCenter, fz.z1 - 1]
  for (const xSide of [-15, 15]) {
    for (const cz of colZs) {
      group.add(app.create('prim', {
        type: 'box',
        size: [1.2, 5, 1.2],
        position: [xSide, 2.5, cz],
        color: COLORS.darkGold,
      }))
      group.add(app.create('prim', {
        type: 'sphere',
        size: [0.7],
        position: [xSide, 5.4, cz],
        color: COLORS.gold,
        emissive: COLORS.gold,
        emissiveIntensity: 1.5,
      }))
    }
  }

  // Gold accent strips on the floor
  for (const az of [fz.z0 + 0.3, fz.z1 - 0.3]) {
    group.add(app.create('prim', {
      type: 'box',
      size: [FIELD_WIDTH, 0.05, 0.3],
      position: [0, 0.01, az],
      color: COLORS.gold,
      emissive: COLORS.gold,
      emissiveIntensity: 1.0,
    }))
  }
}

// --- City Skyline ---

function buildSkyline(app, group) {
  const buildings = [
    // [x, z, width, height, depth, color]
    // Left side
    [-22, 3,  3, 12, 4, '#37474F'],
    [-21, 9,  4, 8,  3, '#455A64'],
    [-23, 15, 3, 18, 5, '#263238'],
    [-21, 22, 4, 10, 4, '#37474F'],
    [-22, 29, 3, 22, 4, '#1A237E'],
    [-21, 36, 4, 7,  3, '#455A64'],
    [-23, 42, 3, 15, 5, '#263238'],
    [-21, 49, 4, 9,  4, '#37474F'],
    [-22, 55, 3, 20, 5, '#0D47A1'],
    [-21, 61, 4, 11, 3, '#455A64'],
    [-23, 65, 3, 8,  4, '#263238'],
    // Right side
    [22, 2,   4, 9,  3, '#455A64'],
    [23, 8,   3, 16, 5, '#263238'],
    [21, 15,  4, 7,  4, '#37474F'],
    [22, 22,  3, 20, 4, '#0D47A1'],
    [21, 29,  4, 11, 3, '#455A64'],
    [23, 35,  3, 14, 5, '#263238'],
    [21, 42,  4, 8,  4, '#37474F'],
    [22, 49,  3, 24, 4, '#1A237E'],
    [21, 55,  4, 10, 3, '#455A64'],
    [23, 61,  3, 13, 5, '#263238'],
    [21, 65,  4, 6,  3, '#37474F'],
  ]

  for (const [x, z, w, h, d, color] of buildings) {
    group.add(app.create('prim', {
      type: 'box',
      size: [w, h, d],
      position: [x, h / 2, z],
      color,
    }))

    // Glowing window rows on tall buildings
    if (h >= 14) {
      const faceX = x > 0 ? x - w / 2 - 0.01 : x + w / 2 + 0.01
      for (const yFrac of [0.3, 0.5, 0.7]) {
        group.add(app.create('prim', {
          type: 'box',
          size: [0.1, 0.4, d - 0.5],
          position: [faceX, h * yFrac, z],
          color: '#FFECB3',
          emissive: '#FFECB3',
          emissiveIntensity: 1.0,
        }))
      }
    }

    // Rooftop light on every other building
    if (h >= 10 && Math.abs(z) % 6 < 3) {
      group.add(app.create('prim', {
        type: 'sphere',
        size: [0.3],
        position: [x, h + 0.3, z],
        color: '#FF1744',
        emissive: '#FF1744',
        emissiveIntensity: 1.5,
      }))
    }
  }
}

// --- Edge Street Lamps ---

function buildEdgeLamps(app, group) {
  const totalZ = ZONES.finish.z1
  for (let z = 4; z <= totalZ - 2; z += 8) {
    for (const xSide of [-17, 17]) {
      group.add(app.create('prim', {
        type: 'cylinder',
        size: [0.12, 0.12, 5],
        position: [xSide, 2.5, z],
        color: COLORS.lampPost,
      }))
      group.add(app.create('prim', {
        type: 'sphere',
        size: [0.4],
        position: [xSide, 5.3, z],
        color: '#FFECB3',
        emissive: COLORS.lampGlow,
        emissiveIntensity: 1.5,
      }))
    }
  }
}

// --- Curb Danger Markers ---

function buildDangerMarkers(app, group) {
  const curbZones = [
    { zones: [ZONES.curb1a, ZONES.curb1b], color: '#FFC107', intensity: 0.8 },
    { zones: [ZONES.curb2a, ZONES.curb2b], color: '#FF9800', intensity: 1.0 },
    { zones: [ZONES.curb3a, ZONES.curb3b], color: '#F44336', intensity: 1.5 },
  ]

  for (const { zones, color, intensity } of curbZones) {
    for (const cz of zones) {
      const z = (cz.z0 + cz.z1) / 2
      for (const x of [-12, -4, 4, 12]) {
        group.add(app.create('prim', {
          type: 'sphere',
          size: [0.25],
          position: [x, CURB_HEIGHT + 0.25, z],
          color,
          emissive: color,
          emissiveIntensity: intensity,
        }))
      }
    }
  }
}

// --- Side Walls (enclosure) ---

function buildSideWalls(app, group) {
  const totalDepth = ZONES.finish.z1
  const wallHeight = 6
  const wallThickness = 1

  // Left and right walls running the full length
  for (const xSide of [-HALF_WIDTH - wallThickness / 2, HALF_WIDTH + wallThickness / 2]) {
    group.add(app.create('prim', {
      type: 'box',
      size: [wallThickness, wallHeight, totalDepth],
      position: [xSide, wallHeight / 2, totalDepth / 2],
      color: '#37474F',
      physics: 'static',
    }))
  }

  // Back wall behind start
  group.add(app.create('prim', {
    type: 'box',
    size: [FIELD_WIDTH + wallThickness * 2, wallHeight, wallThickness],
    position: [0, wallHeight / 2, -wallThickness / 2],
    color: '#37474F',
    physics: 'static',
  }))

  // Back wall behind finish
  group.add(app.create('prim', {
    type: 'box',
    size: [FIELD_WIDTH + wallThickness * 2, wallHeight, wallThickness],
    position: [0, wallHeight / 2, totalDepth + wallThickness / 2],
    color: '#37474F',
    physics: 'static',
  }))
}

// --- World Floor ---

function buildWorldFloor(app, group) {
  group.add(app.create('prim', {
    type: 'box',
    size: [200, 0.5, 200],
    position: [0, -2, 33],
    color: '#1B2631',
    physics: 'static',
  }))
}

// --- Main entry ---

export function buildDecorations(app, root) {
  buildStartPlaza(app, root)
  buildSafeZonePark(app, root, ZONES.safe1.z0, ZONES.safe1.z1)
  buildSafeZonePark(app, root, ZONES.safe2.z0, ZONES.safe2.z1)
  buildFinishHall(app, root)
  buildSkyline(app, root)
  buildEdgeLamps(app, root)
  buildDangerMarkers(app, root)
  buildSideWalls(app, root)
  buildWorldFloor(app, root)
}

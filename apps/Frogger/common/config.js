// --- Dimensions ---
export const FIELD_WIDTH = 20
export const HALF_WIDTH = FIELD_WIDTH / 2

export const BUS_SPAWN_X = 12
export const BUS_DESPAWN_X = 12

export const TUNNEL_X = 11
export const TUNNEL_DEPTH = 2
export const TUNNEL_HEIGHT = 3.5

export const CURB_HEIGHT = 0.3
export const ROAD_DEPTH = 8
export const LANE_DEPTH = 2.5
export const LANE_GAP = 0.25
export const FLOOR_THICKNESS = 0.2

// --- Zone Z ranges ---
export const ZONES = {
  start:  { z0: 0,  z1: 5  },
  curb1a: { z0: 5,  z1: 6  },
  road1:  { z0: 6,  z1: 14 },
  curb1b: { z0: 14, z1: 15 },
  safe1:  { z0: 15, z1: 20 },
  curb2a: { z0: 20, z1: 21 },
  road2:  { z0: 21, z1: 29 },
  curb2b: { z0: 29, z1: 30 },
  safe2:  { z0: 30, z1: 35 },
  curb3a: { z0: 35, z1: 36 },
  road3:  { z0: 36, z1: 44 },
  curb3b: { z0: 44, z1: 45 },
  finish: { z0: 45, z1: 48 },
}

// --- Road Z ranges for hit validation ---
export const ROAD_RANGES = [
  { z0: 6, z1: 14 },
  { z0: 21, z1: 29 },
  { z0: 36, z1: 44 },
]

// --- Lane configurations ---
function makeLanes(road, roadZ0, speeds, intervals, dirs, busLen) {
  return speeds.map((speed, i) => ({
    road,
    laneIdx: i,
    zCenter: roadZ0 + 1.25 + i * (LANE_DEPTH + LANE_GAP),
    direction: dirs[i],
    speed,
    interval: intervals[i],
    busLength: busLen,
  }))
}

export const LANES = [
  ...makeLanes(0, 6,  [3, 4, 3.5],     [3.0, 2.5, 3.0], [1, -1, 1],  6),
  ...makeLanes(1, 21, [5, 6, 5.5],     [2.5, 2.0, 2.5], [-1, 1, -1], 6),
  ...makeLanes(2, 36, [7, 8, 7.5],     [2.0, 1.5, 2.0], [1, -1, 1],  8),
]

// --- Colors ---
export const COLORS = {
  grass:      '#4CAF50',
  grassLight: '#66BB6A',
  finish:     '#FFD700',
  road:       '#333333',
  laneMarking:'#FFFFFF',
  curb:       '#999999',
  tunnel:     '#5D4037',
  tunnelInner:'#1A1A1A',
  bus:        ['#FFC107', '#F44336', '#1565C0'],
  busRoof:    ['#E6AC00', '#C62828', '#0D47A1'],
  window:     '#B3E5FC',
  wheel:      '#1A1A1A',
  headlight:  '#FFFFFF',
}

// --- Player ---
export const SPAWN_POINT = [0, 0.5, 2.5]
export const HIT_COOLDOWN = 1.0
export const WIN_TELEPORT_DELAY = 3000
export const BUS_SYNC_INTERVAL = 0.25
export const BUS_SYNC_SNAP_DISTANCE = 1.0
export const BUS_SYNC_CORRECTION_RATE = 12

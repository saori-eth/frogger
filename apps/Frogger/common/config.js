// --- Dimensions ---
export const FIELD_WIDTH = 36
export const HALF_WIDTH = FIELD_WIDTH / 2

export const BUS_SPAWN_X = 20
export const BUS_DESPAWN_X = 20

export const TUNNEL_X = 19
export const TUNNEL_DEPTH = 3
export const TUNNEL_HEIGHT = 5.0

export const CURB_HEIGHT = 0.5
export const ROAD_DEPTH = 10
export const LANE_DEPTH = 3.0
export const LANE_GAP = 0.5
export const FLOOR_THICKNESS = 0.3

// --- Zone Z ranges ---
export const ZONES = {
  start:  { z0: 0,  z1: 8  },
  curb1a: { z0: 8,  z1: 9  },
  road1:  { z0: 9,  z1: 19 },
  curb1b: { z0: 19, z1: 20 },
  safe1:  { z0: 20, z1: 28 },
  curb2a: { z0: 28, z1: 29 },
  road2:  { z0: 29, z1: 39 },
  curb2b: { z0: 39, z1: 40 },
  safe2:  { z0: 40, z1: 48 },
  curb3a: { z0: 48, z1: 49 },
  road3:  { z0: 49, z1: 59 },
  curb3b: { z0: 59, z1: 60 },
  finish: { z0: 60, z1: 66 },
}

// --- Road Z ranges for hit validation ---
export const ROAD_RANGES = [
  { z0: 9, z1: 19 },
  { z0: 29, z1: 39 },
  { z0: 49, z1: 59 },
]

// --- Lane configurations ---
function makeLanes(road, roadZ0, speeds, intervals, dirs, busLen) {
  return speeds.map((speed, i) => ({
    road,
    laneIdx: i,
    zCenter: roadZ0 + LANE_DEPTH / 2 + i * (LANE_DEPTH + LANE_GAP),
    direction: dirs[i],
    speed,
    interval: intervals[i],
    busLength: busLen,
  }))
}

export const LANES = [
  ...makeLanes(0, 9,  [3.6, 4.8, 4.2],   [3.0, 2.5, 3.0], [1, -1, 1],  7),
  ...makeLanes(1, 29, [6.0, 7.2, 6.6],   [2.5, 2.0, 2.5], [-1, 1, -1], 7),
  ...makeLanes(2, 49, [8.0, 9.2, 8.6],   [2.0, 1.5, 2.0], [1, -1, 1],  9),
]

// --- Colors ---
export const COLORS = {
  grass:        '#388E3C',
  grassLight:   '#43A047',
  finish:       '#FFD700',
  road:         '#2C2C2C',
  laneMarking:  '#E0E0E0',
  curb:         '#555555',
  curbStripe:   '#FFC107',
  tunnel:       '#4E342E',
  tunnelInner:  '#0A0A0A',
  bus:          ['#FFC107', '#E53935', '#1565C0'],
  busRoof:      ['#E6AC00', '#B71C1C', '#0D47A1'],
  window:       '#B3E5FC',
  wheel:        '#111111',
  headlight:    '#FFFFEE',
  taillight:    '#FF0000',
  warningLight: '#FF3300',
  lampPost:     '#78909C',
  lampGlow:     '#FFD54F',
  pillar:       '#607D8B',
  gold:         '#FFD700',
  darkGold:     '#B8860B',
}

// --- Player ---
export const SPAWN_POINT = [0, 0.5, 4.0]
export const HIT_COOLDOWN = 4.0
export const WIN_TELEPORT_DELAY = 3000
export const BUS_SYNC_INTERVAL = 0.25
export const BUS_SYNC_SNAP_DISTANCE = 1.0
export const BUS_SYNC_CORRECTION_RATE = 12

export const Position = (x, y, z) => ({ type: 'position', x, y, z })

export const Velocity = (x, y, z) => ({ type: 'velocity', x, y, z })

export const BusData = (road, lane, len, dir) => ({ type: 'busData', road, lane, len, dir })

export const Renderable = () => ({ type: 'renderable', node: null })

export const Trigger = () => ({ type: 'trigger', node: null })

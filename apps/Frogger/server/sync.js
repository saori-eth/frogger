export function createSync(app) {
  const buses = {}

  function getSnapshot() {
    return Object.values(buses).map(bus => ({ ...bus }))
  }

  return {
    getBuses() {
      return buses
    },

    getSnapshot,

    onSpawn(id, data) {
      buses[id] = data
      app.send('busSpawn', data)
    },

    onDespawn(id) {
      delete buses[id]
      app.send('busDespawn', { id })
    },

    updatePositions(ecs) {
      for (const [id, pos] of ecs.query('position', 'busData')) {
        if (buses[id]) {
          buses[id].x = pos.x
        }
      }
    },

    broadcastSnapshot() {
      app.send('busSync', getSnapshot())
    },
  }
}

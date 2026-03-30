export function createSync(app) {
  const buses = {}

  return {
    getBuses() {
      return buses
    },

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
  }
}

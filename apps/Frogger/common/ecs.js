export function createWorld() {
  let nextId = 0
  const entities = new Map()

  return {
    spawn(components) {
      const id = nextId++
      const map = new Map()
      for (const c of components) map.set(c.type, c)
      entities.set(id, map)
      return id
    },

    despawn(id) {
      entities.delete(id)
    },

    get(id, type) {
      return entities.get(id)?.get(type)
    },

    has(id, type) {
      return entities.get(id)?.has(type) ?? false
    },

    query(...types) {
      const result = []
      for (const [id, map] of entities) {
        if (types.every(t => map.has(t))) {
          result.push([id, ...types.map(t => map.get(t))])
        }
      }
      return result
    },

    all() {
      return entities
    }
  }
}

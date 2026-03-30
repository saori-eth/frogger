import { ZONES, FIELD_WIDTH, ROAD_RANGES } from '../../common/config.js'

export function createCollisionSystem(app, world, ecs) {
  let hitCooldown = 0
  let winCooldown = 0

  // Check if player AABB overlaps a bus AABB
  function playerHitsBus(px, pz, busX, busZ, busLen, busWidth) {
    const playerHalfW = 0.3
    const busHalfLen = busLen / 2
    const busHalfW = busWidth / 2
    return (
      px + playerHalfW > busX - busHalfLen &&
      px - playerHalfW < busX + busHalfLen &&
      pz + playerHalfW > busZ - busHalfW &&
      pz - playerHalfW < busZ + busHalfW
    )
  }

  function update(delta) {
    if (hitCooldown > 0) hitCooldown -= delta
    if (winCooldown > 0) winCooldown -= delta

    const player = world.getPlayer()
    if (!player) return

    const px = player.position.x
    const py = player.position.y
    const pz = player.position.z

    // Only check if player is roughly at ground level and within the field
    if (py > 3 || Math.abs(px) > FIELD_WIDTH / 2) return

    // Check bus collisions
    if (hitCooldown <= 0) {
      const onRoad = ROAD_RANGES.some(r => pz >= r.z0 && pz <= r.z1)
      if (onRoad) {
        for (const [id, pos, busData] of ecs.query('position', 'busData')) {
          if (playerHitsBus(px, pz, pos.x, pos.z, busData.len, 2.2)) {
            hitCooldown = 1.5
            app.send('hit', { playerId: player.id })
            return
          }
        }
      }
    }

    // Check finish zone
    if (winCooldown <= 0 && pz >= ZONES.finish.z0 && pz <= ZONES.finish.z1) {
      winCooldown = 5
      app.send('playerWin', { playerId: player.id })
    }
  }

  return { update }
}

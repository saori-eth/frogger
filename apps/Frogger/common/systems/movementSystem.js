export function movementSystem(ecs, delta) {
  for (const [id, pos, vel] of ecs.query('position', 'velocity')) {
    pos.x += vel.x * delta
    pos.y += vel.y * delta
    pos.z += vel.z * delta
  }
}

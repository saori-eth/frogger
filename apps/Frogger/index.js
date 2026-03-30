import { initServer } from './server/init.js'
import { initClient } from './client/init.js'

export default (world, app, fetch, props, setTimeout) => {
  const block = app.get('Block')
  if (block) block.active = false

  if (world.isServer) {
    initServer(app, world, setTimeout)
  }

  if (world.isClient) {
    initClient(app, world, setTimeout)
  }
}

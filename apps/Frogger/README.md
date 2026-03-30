# Frogger

## Overview

`apps/Frogger` is a compact multiplayer Frogger-style minigame built as a Hyperfy app. It creates a three-road crossing course, spawns moving buses on the server, mirrors those buses on each client, and uses trigger/collision events to send players back to the start when they get hit.

The app is split into shared, server, and client modules. The server is authoritative for bus spawning, movement, despawning, and win/hit event handling. Clients build the visible level, render buses locally, and show simple HUD feedback.

## Gameplay

- Players start near `z = 2.5` and move forward through alternating safe zones and roads.
- Three road bands are defined, each with three lanes and increasing traffic speed.
- Buses spawn from left or right tunnel openings depending on lane direction.
- A bus hit sends a `hit` event to the server, which teleports the player back to the spawn point with a short cooldown.
- Entering the invisible finish trigger sends `playerWin`, broadcasts a win message, and teleports the winner back to the start after a short delay.

## Runtime Structure

### Entry

[`index.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/index.js) disables the placeholder `Block` mesh from `assets/Model.glb`, then dispatches to server and client initialization depending on `world.isServer` / `world.isClient`.

### Shared Code

- [`common/config.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/common/config.js) defines the course dimensions, zone boundaries, lane speeds and spawn intervals, colors, spawn point, and cooldown timings.
- [`common/ecs.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/common/ecs.js) provides a very small ECS with `spawn`, `despawn`, `get`, and `query`.
- [`common/components.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/common/components.js) defines plain data components for position, velocity, bus metadata, and render handles.
- [`common/systems/movementSystem.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/common/systems/movementSystem.js) advances entity positions from velocity on both server and client.

### Server

- [`server/init.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/server/init.js) creates the ECS world, registers hit/win event handlers, runs the fixed update loop, and exposes initial state to clients.
- [`server/systems/spawnSystem.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/server/systems/spawnSystem.js) spawns bus entities per lane using interval timers from `LANES`.
- [`server/systems/despawnSystem.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/server/systems/despawnSystem.js) removes buses once they pass the despawn threshold.
- [`server/sync.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/server/sync.js) keeps a serializable `buses` snapshot and broadcasts spawn/despawn events.

### Client

- [`client/init.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/client/init.js) builds the course, hydrates any existing buses from server state, subscribes to bus and player events, and adds the finish trigger.
- [`client/layout.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/client/layout.js) creates the playfield geometry: grass zones, glowing finish slab, road slabs, lane markings, curbs, and tunnel walls.
- [`client/busVisual.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/client/busVisual.js) creates each bus as a kinematic rigidbody with a solid collider, a slightly larger trigger collider, and voxel-style body details.
- [`client/systems/renderSystem.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/client/systems/renderSystem.js) maps server bus ids to local ECS entities and keeps rendered x-positions in sync.
- [`client/hud.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/client/hud.js) shows the title bar, hit flash, and winner announcement overlays.
- [`client/systems/inputSystem.js`](/Users/patrickcleath/projects/frogger/apps/Frogger/client/systems/inputSystem.js) currently just acquires app controls and exposes camera/pointer/screen state for future use.

## Networking Model

- The server owns authoritative bus state and sends `init`, `busSpawn`, `busDespawn`, `playerHit`, and `playerWon`.
- Clients send `hit` when a local player enters a bus trigger and `playerWin` when the local player reaches the finish zone.
- Clients do not receive continuous position messages. Instead, they recreate the same movement locally using the spawned bus velocity and the shared movement system.

## Visual Style

The app follows the project’s blocky style guidance:

- simple box-based terrain
- box/cylinder bus construction
- color-coded road difficulty
- minimal UI overlays for state feedback

## Notes

- The app blueprint is [`Frogger.json`](/Users/patrickcleath/projects/frogger/apps/Frogger/Frogger.json) and is configured as a module-format script app.
- The current implementation relies on player avatar movement in the world rather than custom input-driven pawn logic.

export function createInputSystem(app) {
  const control = app.control()

  // Shared control state readable by other systems
  const state = {
    control,
    camera: control.camera,
    pointer: control.pointer,
    screen: control.screen,
  }

  return state
}

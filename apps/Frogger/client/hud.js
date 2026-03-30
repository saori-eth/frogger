export function createHud(app, setTimeout) {
  // Title bar (always visible)
  const titleUi = app.create('ui', {
    space: 'screen',
    pivot: 'top-center',
    position: [0.5, 0, 0],
    offset: [0, 20, 0],
    width: 220,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: false,
  })
  const titleText = app.create('uitext', {
    value: 'BUS FROGGER',
    fontSize: 24,
    color: '#00FF00',
    fontWeight: 'bold',
    textAlign: 'center',
  })
  titleUi.add(titleText)
  app.add(titleUi)

  // Transient overlays — created/destroyed on demand to avoid black div artifacts
  let activeHit = null
  let activeWin = null

  function showHitFlash() {
    if (activeHit) app.remove(activeHit)
    const ui = app.create('ui', {
      space: 'screen',
      pivot: 'center',
      position: [0.5, 0.3, 0],
      width: 300,
      height: 50,
      backgroundColor: 'rgba(255,0,0,0.7)',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: false,
    })
    const text = app.create('uitext', {
      value: 'HIT! Back to start...',
      fontSize: 18,
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
    })
    ui.add(text)
    app.add(ui)
    activeHit = ui
    setTimeout(() => {
      if (activeHit === ui) {
        app.remove(ui)
        activeHit = null
      }
    }, 1500)
  }

  function showWinMessage(playerName) {
    if (activeWin) app.remove(activeWin)
    const ui = app.create('ui', {
      space: 'screen',
      pivot: 'center',
      position: [0.5, 0.4, 0],
      width: 400,
      height: 80,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: false,
    })
    const text = app.create('uitext', {
      value: `${playerName} crossed safely!`,
      fontSize: 22,
      color: '#FFD700',
      fontWeight: 'bold',
      textAlign: 'center',
    })
    ui.add(text)
    app.add(ui)
    activeWin = ui
    setTimeout(() => {
      if (activeWin === ui) {
        app.remove(ui)
        activeWin = null
      }
    }, 4000)
  }

  return { showHitFlash, showWinMessage }
}

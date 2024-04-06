import { loadDesktop, updateDate, updateTime } from './modules/Setup.js'

// TODO: Implement close/minimize all functionality

loadDesktop()

/**
 *
 */
function updateClock () {
  updateTime()
  updateDate()
}
setInterval(updateClock, 10000) // Update every 10 seconds, doesn't need to be absolutely accurate

import DesktopWindow from './DesktopWindow.js'
import AreaCalculator from './AreaCalculator.js'
import MemoryGame from './MemoryGame.js'
import ChatApp from './ChatApp.js'

const openWindows = []
let highestZIndex = 100
const zIndexCap = 900

/**
 * Open a program in a new window
 * @param {string} programId - The id of the program to open
 */
export function openProgram (programId) {
  const window = new DesktopWindow()
  window.setTitle(programId)

  window.style.zIndex = highestZIndex + 1
  openWindows.push(window)

  // For the chatapp and not declaring variables in a switch statement for linting...
  let program = null
  let loadedTheme = localStorage.getItem('theme')

  switch (programId) {
    case 'memoryGame':
      window.setWidthHeight(420, 400)
      window.setContent(new MemoryGame())
      break
    case 'chatApp':
      window.setWidthHeight(500, 450)
      program = new ChatApp()
      window.setContent(program)
      if (!loadedTheme) loadedTheme = 'light'
      localStorage.setItem('theme', loadedTheme)
      program.setTheme(loadedTheme)
      break
    case 'calculator':
      window.setWidthHeight(400, 300)
      window.setContent(new AreaCalculator())
      break
    default:
      console.log('error', 'Error: Program not found')
  }

  const programDiv = document.getElementById('programs')
  programDiv.appendChild(window)
}

/**
 * Get the highest z-index
 * @returns {number} - The highest z-index
 */
export function getHighestZIndex () {
  return highestZIndex
}

/**
 * Set the highest z-index to a specific value
 * @param {number} zIndex - The z-index to set
 */
export function setHighestZIndex (zIndex) {
  checkAndNormalizeZIndex()
  if (zIndex instanceof Number) {
    highestZIndex = zIndex
  } else {
    highestZIndex = parseInt(zIndex)
  }
}

/**
 * Check if the highest z-index is above the cap and normalize all z-indexes
 */
function checkAndNormalizeZIndex () {
  if (highestZIndex > zIndexCap) {
    openWindows.forEach((window, index) => {
      window.style.zIndex = 100 + index
    })
    highestZIndex = 100 + openWindows.length
  }
}

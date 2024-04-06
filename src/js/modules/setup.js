import { openProgram } from './WindowManager.js'

const main = document.getElementById('main')
const programsData = [
  { id: 'memoryGame', iconPath: 'img/memoryIcon.svg', label: 'Memory Game' },
  { id: 'chatApp', iconPath: 'img/chatIcon.svg', label: 'Chat App' },
  { id: 'calculator', iconPath: 'img/calculatorIcon.svg', label: 'Area Calculator' }
]

/**
 *
 */
export function loadDesktop () {
  loadFooter()
  loadDesktopIcons()
  loadTaskbarIcons()
}

/**
 * Update time
 */
export function updateTime () {
  const clockDiv = document.getElementById('clock')
  const d = new Date()
  clockDiv.textContent = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
}

/**
 * Update date
 */
export function updateDate () {
  const dateDiv = document.getElementById('date')
  const d = new Date()
  dateDiv.textContent = d.toISOString().slice(0, 10)
}

/**
 * Load footer
 */
function loadFooter () {
  const footer = document.createElement('footer')
  footer.setAttribute('id', 'taskbar')
  footer.style.zIndex = 1000

  // Adding logo to the left
  const logoDiv = document.createElement('div')
  logoDiv.setAttribute('id', 'logo')
  logoDiv.innerHTML = '<img src="../../img/winLogo.png" alt="logo" />'

  // Adding clock to the right
  const clockDiv = document.createElement('div')
  clockDiv.setAttribute('id', 'clock')
  const d = new Date()
  clockDiv.textContent = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()

  // Adding date below the clock
  const dateDiv = document.createElement('div')
  dateDiv.setAttribute('id', 'date')
  dateDiv.textContent = d.toISOString().slice(0, 10)

  // Adding line (later will be a button) to the right of the clock
  const minimizeDiv = document.createElement('div')
  minimizeDiv.setAttribute('id', 'closeAllButton')
  minimizeDiv.textContent = '|' // Placeholder for line

  footer.appendChild(logoDiv)
  footer.appendChild(clockDiv)
  footer.appendChild(minimizeDiv)
  footer.appendChild(dateDiv)

  main.appendChild(footer)
}

/**
 * Create high score element
 * @returns {HTMLElement} - The high score element
 */
function createHighScoreElement () {
  const highScoreDiv = document.createElement('div')
  highScoreDiv.classList.add('highScore')
  highScoreDiv.style.padding = '10px'
  highScoreDiv.style.margin = '10px'
  highScoreDiv.style.border = '2px solid #ccc'
  highScoreDiv.style.borderRadius = '5px'
  highScoreDiv.style.backgroundColor = 'transparent'
  highScoreDiv.style.textAlign = 'center'
  highScoreDiv.style.width = '25%'
  highScoreDiv.style.right = '10px'
  highScoreDiv.style.top = '10px'
  highScoreDiv.style.position = 'absolute'

  const highScoreTitle = document.createElement('h3')
  highScoreTitle.textContent = 'Top 10 Scores'
  highScoreTitle.style.margin = '0 0 10px 0'

  const highScoreList = document.createElement('ol')
  highScoreList.id = 'highScoreList'

  highScoreDiv.appendChild(highScoreTitle)
  highScoreDiv.appendChild(highScoreList)

  return highScoreDiv
}

/**
 * Update high score display
 */
export function updateScoreDisplay () {
  const highScores = JSON.parse(localStorage.getItem('memoryGameHighScores')) || []
  const highScoreList = document.getElementById('highScoreList')

  highScoreList.innerHTML = ''

  if (highScores.length === 0) {
    const scoreItem = document.createElement('li')
    scoreItem.textContent = 'No scores yet'
    highScoreList.appendChild(scoreItem)
  }

  highScores.forEach(score => {
    const scoreItem = document.createElement('li')
    scoreItem.textContent = `${score.score} seconds - ${score.date}`
    highScoreList.appendChild(scoreItem)
  })
}

/**
 * Create program element
 * @param {object} program - The program object
 * @returns {HTMLElement} - The program element
 */
function createProgramElement (program) {
  const programDiv = document.createElement('div')
  programDiv.classList.add('program')
  programDiv.id = program.id
  programDiv.style.height = 'min-content'
  programDiv.style.width = 'min-content'

  const iconDiv = document.createElement('div')
  iconDiv.classList.add('programIcon', 'desktopIcon')

  loadSVG(program.iconPath).then(svg => {
    iconDiv.innerHTML = svg
    const svgElement = iconDiv.querySelector('svg')
    if (svgElement) {
      svgElement.setAttribute('width', '100%')
      svgElement.setAttribute('height', '100%')
    }
  })

  const figCaption = document.createElement('figcaption')
  figCaption.textContent = program.label
  figCaption.style.userSelect = 'none'
  figCaption.classList.add('programDesc')

  programDiv.appendChild(iconDiv)
  programDiv.appendChild(figCaption)

  programDiv.addEventListener('click', (event) => {
    event.stopPropagation()

    document.querySelectorAll('.program').forEach(p => {
      p.style.backgroundColor = ''
    })
    // A single click on desktop will highlight the program icon
    programDiv.style.backgroundColor = 'rgb(0, 0, 255, 0.2)'
  })

  programDiv.addEventListener('dblclick', () => {
    // Double click on desktop will open the program
    openProgram(program.id)
  })

  return programDiv
}

/**
 * Load desktop icons
 */
function loadDesktopIcons () {
  const desktop = document.querySelector('.desktop')
  programsData.forEach(program => {
    desktop.appendChild(createProgramElement(program))
  })
  // A single click on desktop will un-highlight the program icon
  desktop.addEventListener('click', () => {
    document.querySelectorAll('.program').forEach(p => {
      p.style.backgroundColor = ''
    })
  })
  desktop.appendChild(createHighScoreElement())
  updateScoreDisplay()
}

/**
 * Create taskbar element
 * @param {object} program - The program object
 * @returns {HTMLElement} - The taskbar element
 */
function createTaskbarElement (program) {
  const programDiv = document.createElement('div')
  programDiv.classList.add('program')
  programDiv.id = program.id

  const iconDiv = document.createElement('div')
  iconDiv.classList.add('programIcon', 'taskbarIcon')

  loadSVG(program.iconPath).then(svg => {
    iconDiv.innerHTML = svg
    const svgElement = iconDiv.querySelector('svg')
    if (svgElement) {
      svgElement.setAttribute('width', '100%')
      svgElement.setAttribute('height', '100%')
    }
  })

  programDiv.appendChild(iconDiv)

  // Add event listener to open program
  iconDiv.addEventListener('click', () => {
    // A single click on desktop will open the program
    openProgram(program.id)
  })

  return iconDiv
}

/**
 * Load taskbar icons
 */
function loadTaskbarIcons () {
  const taskbar = document.getElementById('taskbar')
  programsData.forEach(program => {
    taskbar.appendChild(createTaskbarElement(program))
  })
}

/**
 * Load SVG from file
 * @param {string} filePath - The path to the SVG file
 * @returns {string} - SVG text
 */
async function loadSVG (filePath) {
  try {
    const response = await fetch(filePath)
    const svgText = await response.text()
    return svgText
  } catch (error) {
    console.error('Error fetching SVG:', error)
  }
}

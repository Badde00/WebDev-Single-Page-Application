import { getHighestZIndex, setHighestZIndex } from './WindowManager.js'

export default class DesktopWindow extends HTMLElement {
  static windowCount = 0
  static windowOffset = 20

  constructor (width, height) {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="../../css/window.css">
    `
    const windowDiv = document.createElement('div')
    windowDiv.id = 'window'

    const topBar = document.createElement('div')
    topBar.id = 'window-topbar'
    topBar.style.color = 'black'
    topBar.style.userSelect = 'none'

    const windowTitle = document.createElement('div')
    windowTitle.id = 'window-title'

    const closeButton = document.createElement('button')
    closeButton.id = 'window-close-button'
    closeButton.textContent = 'X'
    closeButton.style.float = 'right'
    closeButton.style.marginBottom = '1px'

    const contentArea = document.createElement('div')
    contentArea.id = 'window-content'

    topBar.appendChild(windowTitle)
    topBar.appendChild(closeButton)

    windowDiv.appendChild(topBar)
    windowDiv.appendChild(contentArea)

    this.shadowRoot.appendChild(windowDiv)

    this.topbar = topBar
    this.windowTitle = windowTitle
    this.closeButton = closeButton
    this.contentArea = contentArea

    DesktopWindow.windowCount++
    this.style.left = `${100 + DesktopWindow.windowOffset * DesktopWindow.windowCount}px`
    this.style.top = `${0 + DesktopWindow.windowOffset * DesktopWindow.windowCount}px`
    this.style.position = 'absolute'

    console.log('dispatchingListener')
    this.addEventListener('themeChange', (event) => {
      this.setWindowTheme(event.detail.theme)
    })

    this.initializeDragAndDrop()
    this.initializeFocus()
    this.initializeClose()
  }

  setWindowTheme (theme) {
    console.log('DW new theme: ', theme)
    const windowDiv = this.shadowRoot.getElementById('window')
    if (theme === 'dark') { // Only background is changed because a higher level sets color to black and needs to be changed in a different location
      windowDiv.style.backgroundColor = '#333'
    } else {
      windowDiv.style.backgroundColor = '#fff'
    }
  }

  adjustWindowPosition (width, height) {
    const maxLeft = window.innerWidth - 5 - width
    const maxTop = window.innerHeight - 42 - height

    let left = (100 + DesktopWindow.windowOffset * DesktopWindow.windowCount) % maxLeft
    let top = (0 + DesktopWindow.windowOffset * DesktopWindow.windowCount) % maxTop

    if (left + width > window.innerWidth) {
      left = 0
    }
    if (top + height > window.innerHeight) {
      top = 0
    }

    this.style.left = `${left}px`
    this.style.top = `${top}px`
  }

  setWidthHeight (width, height) {
    this.style.width = `${width}px`
    this.style.height = `${height}px`
    this.adjustWindowPosition(width, height)
  }

  initializeDragAndDrop () {
    let isDragging = false
    let startX = 50 + DesktopWindow.windowOffset * DesktopWindow.windowCount
    let startY = 50 + DesktopWindow.windowOffset * DesktopWindow.windowCount

    const onMouseDown = (event) => {
      isDragging = true
      startX = event.clientX - this.offsetLeft
      startY = event.clientY - this.offsetTop
      this.style.zIndex = getHighestZIndex() + 10
    }

    const onMouseMove = (event) => {
      if (!isDragging) return
      let newX = event.clientX - startX
      let newY = event.clientY - startY

      const maxLeft = window.innerWidth - 5 - this.offsetWidth
      const maxTop = window.innerHeight - 42 - this.offsetHeight

      newX = Math.max(Math.min(newX, maxLeft), 0)
      newY = Math.max(Math.min(newY, maxTop), 0)

      this.style.left = `${newX}px`
      this.style.top = `${newY}px`
    }

    const onMouseUp = () => {
      isDragging = false
    }

    this.topbar.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  initializeFocus () {
    this.addEventListener('click', () => {
      const currentHighestZIndex = getHighestZIndex()
      const newZIndex = currentHighestZIndex + 1
      this.style.zIndex = newZIndex
      setHighestZIndex(newZIndex)
    })
  }

  initializeClose () {
    this.closeButton.addEventListener('click', () => {
      this.remove()
    })
  }

  setTitle (windowTitle) {
    this.windowTitle.innerText = windowTitle
  }

  setContent (content) {
    if (content instanceof HTMLElement) {
      this.contentArea.innerHTML = ''
      this.contentArea.appendChild(content)
    } else {
      this.contentArea.textContent = content
    }
  }
}

window.customElements.define('desktop-window', DesktopWindow)

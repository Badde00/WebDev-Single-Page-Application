import { updateScoreDisplay } from './Setup.js'

export default class MemoryGame extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.cardsArray = this.generateCards()
    this.flippedCards = []
    this.matches = 0
    this.gameStarted = false
    this.createUI()
  }

  startTimer () {
    this.startTime = Date.now()
    this.timerInterval = setInterval(() => this.updateTimer(), 1000)
  }

  updateTimer () {
    const now = Date.now()
    const elapsedTime = Math.round((now - this.startTime) / 1000)
    const minutes = Math.floor(elapsedTime / 60)
    const seconds = elapsedTime % 60
    const timer = this.shadowRoot.getElementById('timer')
    timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  stopTimer () {
    clearInterval(this.timerInterval)
    const totalTime = Math.round((Date.now() - this.startTime) / 1000)
    this.checkHighScore(totalTime)
  }

  checkHighScore (time) {
    const highScore = JSON.parse(localStorage.getItem('memoryGameHighScores')) || []
    highScore.push({ score: time, date: new Date().toLocaleString() })
    highScore.sort((a, b) => a.score - b.score)
    highScore.splice(10)
    localStorage.setItem('memoryGameHighScores', JSON.stringify(highScore))
    updateScoreDisplay()
  }

  generateCards () {
    const symbols = ['🍕', '🍔', '🍟', '🌭', '🍿', '🍦', '🍩', '🍪']
    const cards = [...symbols, ...symbols]
    return cards.sort(() => Math.random() - 0.5)
  }

  handleKeyDown (event, index, card, symbol) {
    const rowSize = 4
    let targetIndex = index

    switch (event.key) {
      case 'ArrowRight':
        targetIndex = (index + 1) % this.cardsArray.length
        break
      case 'ArrowLeft':
        targetIndex = (index - 1 + this.cardsArray.length) % this.cardsArray.length
        break
      case 'ArrowUp':
        targetIndex = (index - rowSize + this.cardsArray.length) % this.cardsArray.length
        break
      case 'ArrowDown':
        targetIndex = (index + rowSize) % this.cardsArray.length
        break
      case 'Enter':
      case ' ':
        this.flipCard(card, symbol)
        return
    }

    const targetCard = this.shadowRoot.querySelectorAll('.card')[targetIndex]
    targetCard.focus()
  }

  createUI () {
    const timer = document.createElement('div')
    timer.id = 'timer'
    timer.style.display = 'flex'
    timer.style.justifyContent = 'center'
    timer.style.padding = '10px 10px 0 10px'
    timer.style.color = 'black'
    timer.textContent = '0:00'
    timer.style.userSelect = 'none'

    const grid = document.createElement('div')
    grid.style.display = 'grid'
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)'
    grid.style.gap = '10px'
    grid.style.margin = '10px'

    this.cardsArray.forEach((symbol, index) => {
      const card = document.createElement('div')
      card.setAttribute('class', 'card')
      card.dataset.symbol = symbol
      card.style.userSelect = 'none'
      card.style.border = '1px solid #ccc'
      card.style.borderRadius = '2px'
      card.style.display = 'flex'
      card.style.alignItems = 'center'
      card.style.justifyContent = 'center'
      card.style.aspectRatio = '1/0.8'
      card.style.fontSize = '2rem'
      card.style.backgroundColor = '#f3f3f3'
      card.style.cursor = 'pointer'
      card.setAttribute('tabindex', 0)

      card.addEventListener('click', () => this.flipCard(card, symbol))
      card.addEventListener('keydown', (event) => {
        this.handleKeyDown(event, index, card, symbol)
      })
      grid.appendChild(card)
    })

    this.shadowRoot.appendChild(timer)
    this.shadowRoot.appendChild(grid)
  }

  flipCard (card, symbol) {
    if (!this.gameStarted) {
      this.gameStarted = true
      this.startTimer()
    }

    console.log('pre-flip', card)
    if (card.classList.contains('flipped') || this.flippedCards.includes(card)) {
      console.log(card.classList.contains('flipped'))
      return
    }

    if (this.flippedCards.length < 2 && !card.classList.contains('flipped')) {
      card.textContent = symbol
      card.classList.add('flipped')
      this.flippedCards.push(card)

      if (this.flippedCards.length === 2) {
        this.checkForMatch()
      }
    }
  }

  checkForMatch () {
    const [card1, card2] = this.flippedCards

    if (card1.dataset.symbol === card2.dataset.symbol) {
      this.matches += 1
      this.flippedCards = [] // Reset for the next turn
      if (this.matches === this.cardsArray.length / 2) {
        this.stopTimer()
        alert('You won!')
      }
    } else {
      setTimeout(() => {
        this.flippedCards.forEach(card => {
          card.textContent = ''
          card.classList.remove('flipped')
        })
        this.flippedCards = [] // Reset for the next turn
      }, 1000)
    }
  }
}

customElements.define('memory-game', MemoryGame)

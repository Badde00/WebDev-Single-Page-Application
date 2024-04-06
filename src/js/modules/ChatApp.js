export default class ChatApp extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    this.serverUrl = 'wss://courselab.lnu.se/message-app/socket'
    this.username = 'temp'
    this.username = this.getUsername()
    this.initializeWebSocket()
    this.createUI()
  }

  getUsername () {
    let username = localStorage.getItem('username')
    if (!username) {
      username = prompt('Enter your username')
      localStorage.setItem('username', username)
    }
    return username
  }

  initializeWebSocket () {
    this.socket = new WebSocket(this.serverUrl)

    this.socket.addEventListener('open', (event) => console.log('Connected! Event:', event))
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      if (message.type !== 'heartbeat') {
        this.displayMessage(message)
      }
    })

    this.socket.addEventListener('error', (event) => {
      console.log('Error', event)
    })
  }

  createUI () {
    const chatContainer = document.createElement('div')
    chatContainer.style.display = 'flex'
    chatContainer.style.flexDirection = 'column'
    chatContainer.style.height = '90%'
    chatContainer.style.maxHeight = '400px'
    chatContainer.style.width = '95%'
    chatContainer.style.padding = '10px'
    this.chatContainer = chatContainer

    const messageList = document.createElement('ul')
    messageList.id = 'messageList'
    messageList.style.flexGrow = '.85'
    messageList.style.overflowY = 'auto'
    messageList.style.listStyle = 'none'
    messageList.style.paddingLeft = '10px'

    const inputContainer = document.createElement('div')
    inputContainer.style.display = 'flex'
    inputContainer.style.marginTop = 'auto'
    inputContainer.style.flexShrink = '0'
    this.inputContainer = inputContainer

    const messageInput = document.createElement('textarea')
    messageInput.id = 'messageInput'
    messageInput.placeholder = 'Write a message...'
    messageInput.style.width = '70%'
    messageInput.style.height = '85%'
    messageInput.style.marginLeft = '5px'
    messageInput.style.resize = 'none'
    this.messageInput = messageInput

    const sendButton = document.createElement('button')
    sendButton.textContent = 'Send'
    sendButton.addEventListener('click', () => this.sendMessage())
    this.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        this.sendMessage()
      }
    })
    sendButton.style.width = '20%'
    sendButton.style.height = '100%'
    sendButton.style.marginLeft = '5px'
    sendButton.style.marginTop = '1px'
    sendButton.style.padding = '2px'
    this.sendButton = sendButton

    const themeToggleButton = document.createElement('button')
    themeToggleButton.textContent = 'Toggle Theme'
    themeToggleButton.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('theme')
      const newTheme = currentTheme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      this.setTheme(newTheme)
    })

    inputContainer.appendChild(messageInput)
    inputContainer.appendChild(sendButton)

    chatContainer.appendChild(themeToggleButton)
    chatContainer.appendChild(messageList)
    chatContainer.appendChild(inputContainer)
    this.shadowRoot.appendChild(chatContainer)
  }

  setTheme (theme) {
    console.log('CA new theme: ', theme)
    if (theme === 'light') {
      this.chatContainer.style.color = 'black'
      this.messageInput.style.backgroundColor = 'white'
      this.messageInput.style.color = 'black'
      this.sendButton.style.backgroundColor = 'white'
      this.sendButton.style.color = 'black'
    } else {
      this.chatContainer.style.color = 'white'
      this.messageInput.style.backgroundColor = '#555'
      this.messageInput.style.color = 'white'
      this.sendButton.style.backgroundColor = '#555'
      this.sendButton.style.color = 'white'
    }
    console.log('dispatching themeChange')
    this.dispatchEvent(new CustomEvent('themeChange', { detail: { theme }, bubbles: true, composed: true }))
  }

  sendMessage () {
    const messageInput = this.shadowRoot.getElementById('messageInput')
    const messageText = messageInput.value.trim()

    if (messageText) {
      const messageData = {
        type: 'message',
        data: messageText,
        username: this.username,
        channel: this.channel,
        key: this.apiKey
      }

      this.socket.send(JSON.stringify(messageData))
      messageInput.value = ''
    }
  }

  displayMessage (message) {
    const messageList = this.shadowRoot.getElementById('messageList')
    const messageElement = document.createElement('li')
    messageElement.textContent = `${message.username}: ${message.data}`
    messageList.appendChild(messageElement)

    while (messageList.children.length > 20) {
      messageList.removeChild(messageList.firstChild)
    }

    messageList.scrollTop = messageList.scrollHeight
  }
}

customElements.define('chat-app', ChatApp)

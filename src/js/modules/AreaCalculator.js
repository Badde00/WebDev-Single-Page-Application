export default class AreaCalculator extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.createUI()
  }

  createUI () {
    const form = document.createElement('form')
    form.style.padding = '10px'
    form.style.display = 'flex'
    form.style.flexDirection = 'column'
    form.style.gap = '10px'

    const shapeSelect = document.createElement('select')
    const inputA = document.createElement('input')
    const inputB = document.createElement('input')
    const resultDiv = document.createElement('div')

    const calculateButton = document.createElement('button')
    calculateButton.disabled = true

    shapeSelect.innerHTML = `
      <option value="" selected="true" disabled="disabled">Select a shape</option>
      <option value="rectangle">Rectangle</option>
      <option value="triangle">Triangle</option>
      <option value="circle">Circle</option>
      <option value="rhombus">Rhombus</option>
    `
    shapeSelect.addEventListener('change', () => {
      this.updateInputFields(shapeSelect.value)
      calculateButton.disabled = false
    })

    inputA.type = 'number'
    inputA.style.display = 'none'

    inputB.type = 'number'
    inputB.style.display = 'none'

    this.inputA = inputA
    this.inputB = inputB
    this.resultDiv = resultDiv

    calculateButton.textContent = 'Calculate Area'
    calculateButton.type = 'button'
    calculateButton.addEventListener('click', () => {
      this.calculateArea(shapeSelect.value)
    })

    form.appendChild(shapeSelect)
    form.appendChild(inputA)
    form.appendChild(inputB)
    form.appendChild(calculateButton)
    form.appendChild(resultDiv)

    this.shadowRoot.appendChild(form)
  }

  calculateArea (shape) {
    let area = 0
    const a = parseFloat(this.inputA.value)
    const b = parseFloat(this.inputB.value)

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      this.resultDiv.textContent = 'Invalid input'
      return
    }

    switch (shape) {
      case 'rectangle':
        area = a * b
        break
      case 'triangle':
        area = 0.5 * a * b
        break
      case 'circle':
        area = Math.PI * a * a
        break
      case 'rhombus':
        area = a * b / 2
        break
      default:
        this.resultDiv.textContent = 'Invalid shape'
        return
    }

    this.resultDiv.textContent = `The area of the ${shape} is ${area.toFixed(2)} unit\u00B2`
  }

  updateInputFields (shape) {
    // Reset input
    this.inputA.value = ''
    this.inputB.value = ''
    this.inputA.style.display = 'none'
    this.inputB.style.display = 'none'

    switch (shape) {
      case 'rectangle':
        this.inputA.style.display = 'block'
        this.inputB.style.display = 'block'
        this.inputA.placeholder = 'Length'
        this.inputB.placeholder = 'Width'
        break
      case 'triangle':
        this.inputA.style.display = 'block'
        this.inputB.style.display = 'block'
        this.inputA.placeholder = 'Base'
        this.inputB.placeholder = 'Height'
        break
      case 'circle':
        this.inputA.style.display = 'block'
        this.inputA.placeholder = 'Radius'
        // Hide inputB, but not fuck up the validity checker in calculateArea
        this.inputB.value = '1'
        break
      case 'rhombus':
        this.inputA.style.display = 'block'
        this.inputB.style.display = 'block'
        this.inputA.placeholder = 'Diagonal 1'
        this.inputB.placeholder = 'Diagonal 2'
        break
      default:
        break
    }
  }
}

customElements.define('area-calculator', AreaCalculator)

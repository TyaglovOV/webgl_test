import { getContext, setCanvasToFullScreen } from '../utils'
import { lesson2 } from '../shadersData/vectorField3Multiple'
import { Program } from '../programs/program'
import { VertexShader } from '../shaders/vertexShader'
import { FragmentShader } from '../shaders/fragmentShader'

export function startApp(canvas: HTMLCanvasElement) {
  let rows = 20
  let cols = 20
  let recalced = true

  setCanvasToFullScreen(canvas)
  const gl = getContext(canvas)

  // to initialize START
  const shaders = [
    new VertexShader(gl, lesson2[0]),
    new FragmentShader(gl, lesson2[1])
  ]

  const program = new Program(gl, shaders[0], shaders[1])
  program.use()

  gl.clearColor(1, 1, 1,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  let dotsVertex = createDots(rows, cols, canvas.width, canvas.height)
  // создаем буфер
  const dotsBuffer = gl.createBuffer()
  // биндим буфер в видеокарте, теперь запись идет туда
  gl.bindBuffer(gl.ARRAY_BUFFER, dotsBuffer)
  // закладываем данные в наш буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsVertex), gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const u_Pos1 = gl.getUniformLocation(program.program, 'u_Pos1')
  const u_Pos2 = gl.getUniformLocation(program.program, 'u_Pos2')
  const u_Pos3 = gl.getUniformLocation(program.program, 'u_Pos3')


  const u_Pow = gl.getUniformLocation(program.program, 'u_Pow')
  const u_Multiplier = gl.getUniformLocation(program.program, 'u_Multiplier')
  const u_Inverse = gl.getUniformLocation(program.program, 'u_Inverse')

  // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели
  gl.enableVertexAttribArray(a_Position)

  gl.uniform2f(u_Pos1, Math.random(), Math.random())
  gl.uniform2f(u_Pos2, Math.random(), Math.random())
  gl.uniform2f(u_Pos3, Math.random(), Math.random())

  gl.uniform1f(u_Pow, 2.0)
  gl.uniform1f(u_Multiplier, 0.03)
  gl.uniform1f(u_Inverse, 1.0)

  function animate (time: number) {
    gl.clear(gl.COLOR_BUFFER_BIT)

    if (!recalced) {
      dotsVertex = createDots(rows, cols, canvas.width, canvas.height)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsVertex), gl.STATIC_DRAW)

      recalced = true
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 3, 0)

    gl.drawArrays(gl.LINES, 0, dotsVertex.length / 3)

    requestAnimationFrame(animate)
  }

  initGui()

  animate(0)

  function changeMultiplier(value: number) {
    gl.uniform1f(u_Multiplier, value)
  }

  function changePow(value: number) {
    gl.uniform1f(u_Pow, value)
  }

  function changeInverse(value: number) {
    gl.uniform1f(u_Inverse, value)
  }

  function initGui () {
    const guiWrapper = document.getElementById('guiWrapper')

    const colsInput = document.getElementById('cols')
    const rowsInput = document.getElementById('rows')
    const powRange = document.getElementById('pow')
    const multiplierRange = document.getElementById('multiplier')
    const inverseCheckbox = document.getElementById('inverse')

    //@ts-ignore
    colsInput.value = cols
    //@ts-ignore
    rowsInput.value = rows

    document.addEventListener('keypress', (event) => {
      if (event.key === 'p') {
        guiWrapper.classList.toggle('hidden')
      }
    })

    canvas.addEventListener('mousemove', (event) => {
      gl.uniform2f(u_Pos1, event.x / canvas.width, (canvas.height - event.y) / canvas.height)
    })

    let period = 2

    canvas.addEventListener('click', (event) => {
      gl.uniform2f(period === 2 ? u_Pos2 : u_Pos3, event.x / canvas.width, (canvas.height - event.y) / canvas.height)
      period = period === 2 ? 3 : 2
    })

    colsInput.addEventListener('input', (event) => {
      //@ts-ignore
      cols = event.target.value
      recalced = false
    })

    rowsInput.addEventListener('input', (event) => {
      //@ts-ignore
      rows = event.target.value
      recalced = false
    })

    powRange.addEventListener('input', (event) => {
      //@ts-ignore
      changePow(Number(event.target.value))
    })

    multiplierRange.addEventListener('input', (event) => {
      //@ts-ignore
      changeMultiplier(Number(event.target.value))
    })

    inverseCheckbox.addEventListener('input', (event) => {
      let inverseValue = 1.0
      //@ts-ignore
      console.log(event.target.checked)
      //@ts-ignore
      if (event.target.checked) {
        inverseValue = -1.0
      }

      changeInverse(inverseValue)
    })
  }
}

function createDots (rows: number, cols: number, width: number, height: number): number[] {
  const dots: number[] = []
  let pointer = 0

  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < cols; k++) {
      addData(i + 0.5, k + 0.5)
    }
  }

  function addData(row: number, col: number) {
    dots[pointer] = (col / cols)
    dots[pointer + 1] = (row / rows)
    dots[pointer + 2] = 0.0
    dots[pointer + 3] = (col / cols)
    dots[pointer + 4] = (row / rows)
    dots[pointer + 5] = 1.0

    pointer += 6
  }

  return dots
}

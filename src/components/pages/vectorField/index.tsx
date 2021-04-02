import { getContext, setCanvasToFullScreen } from '../../../utils/utils'
import { vectorFieldShaders } from './shaders'
import { Program } from '../../../programs/program'
import ReactDOM from 'react-dom'
import { FormEvent } from 'react'

function createDots (rows: number, cols: number): number[] {
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

export function  createVectorField(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)
  const controls = document.createElement('div')

  let rows = 20
  let cols = 20
  let recalced = true

  const gl = getContext(canvas)

  const program = new Program(gl, vectorFieldShaders)
  program.use()

  gl.clearColor(1, 1, 1,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  let dotsVertex = createDots(rows, cols)
  // создаем буфер
  const dotsBuffer = gl.createBuffer()
  // биндим буфер в видеокарте, теперь запись идет туда
  gl.bindBuffer(gl.ARRAY_BUFFER, dotsBuffer)
  // закладываем данные в наш буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsVertex), gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const u_Pos1 = gl.getUniformLocation(program.program, 'u_Pos1')
  const u_Pow = gl.getUniformLocation(program.program, 'u_Pow')
  const u_Multiplier = gl.getUniformLocation(program.program, 'u_Multiplier')
  const u_Inverse = gl.getUniformLocation(program.program, 'u_Inverse')

  // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели
  gl.enableVertexAttribArray(a_Position)

  gl.uniform2f(u_Pos1, Math.random(), Math.random())
  gl.uniform1f(u_Pow, 2.0)
  gl.uniform1f(u_Multiplier, 0.03)
  gl.uniform1f(u_Inverse, 1.0)

  let done = false

  function animate (time: number) {
    if (done) {
      return
    }

    gl.clear(gl.COLOR_BUFFER_BIT)

    if (!recalced) {
      dotsVertex = createDots(rows, cols)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsVertex), gl.STATIC_DRAW)

      recalced = true
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 3, 0)

    gl.drawArrays(gl.LINES, 0, dotsVertex.length / 3)

    requestAnimationFrame(animate)
  }

  function changeMultiplier(event: FormEvent) {
    //@ts-ignore
    gl.uniform1f(u_Multiplier, Number(event.currentTarget.value))
  }

  function changePow(event: FormEvent) {
    //@ts-ignore
    gl.uniform1f(u_Pow, Number(event.currentTarget.value))
  }

  function changeInverse(event: FormEvent) {
    let inverseValue = 1.0

    //@ts-ignore
    if (event.target.checked) {
      inverseValue = -1.0
    }

    gl.uniform1f(u_Inverse, inverseValue)
  }

  function mouseMove(event: MouseEvent) {
    gl.uniform2f(u_Pos1, event.x / canvas.clientWidth, (canvas.clientHeight - event.y) / canvas.clientHeight)
  }

  function changeRows(event: FormEvent) {
    //@ts-ignore
    rows = event.target.value
    recalced = false
  }

  function changeCols(event: FormEvent) {
    //@ts-ignore
    cols = event.target.value
    recalced = false
  }

  function init() {
    canvas.addEventListener('mousemove', mouseMove)
    done = false

    animate(0)
  }

  function createControls() {
    controlParent.appendChild(controls)

    ReactDOM.render(
      <div>
        <div>
          <label htmlFor="cols">столбцов</label>
          <input onInput={changeRows} type="range" id="cols" min="1" max="1000" step="1" />
        </div>
        <div>
          <label htmlFor="rows">строк</label>
          <input onInput={changeCols} type="range" id="rows" min="1" max="1000" step="1" />
        </div>
        <div>
          <label htmlFor="multiplier">множитель силы</label>
          <input onInput={changeMultiplier} type="range" id="multiplier" min="0" max="0.2" step="0.001" />
        </div>
        <div>
          <label htmlFor="pow">угасание силы</label>
          <input onInput={changePow} type="range" id="pow" min="0.1" max="10" step="0.02" />
        </div>
        <div>
          <label htmlFor="inverse">инверсия сил</label>
          <input onChange={changeInverse} type="checkbox" id="inverse" />
        </div>
      </div>,
      controls
    )
  }

  function clear() {
    done = true
    canvas.removeEventListener('mousemove', mouseMove)
    controlParent.removeChild(controls)
  }

  return {
    init,
    createControls,
    clear
  }
}

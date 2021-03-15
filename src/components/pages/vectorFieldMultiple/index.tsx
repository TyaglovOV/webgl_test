import { getContext, setCanvasToFullScreen } from '../../../utils/utils'
import { vectorFieldMultipleShaders } from './shaders'
import { Program } from '../../../programs/program';
import { VertexShader } from '../../../shaders/vertexShader';
import { FragmentShader } from '../../../shaders/fragmentShader'
import ReactDOM from 'react-dom';
import { FormEvent } from 'react';

export function createVectorFieldMultiple(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  const controls = document.createElement('div')
  let rows = 20
  let cols = 20
  let recalced = true

  setCanvasToFullScreen(canvas)
  const gl = getContext(canvas)

  // to initialize START
  const shaders = [
    new VertexShader(gl, vectorFieldMultipleShaders[0]),
    new FragmentShader(gl, vectorFieldMultipleShaders[1])
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

  let done = false

  function animate (time: number) {
    if (done) {
      return
    }

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

  function changeMultiplier(event: FormEvent) {
    //@ts-ignore
    gl.uniform1f(u_Multiplier, Number(event.currentTarget.value))
  }

  function changePow(event: FormEvent) {
    //@ts-ignore
    gl.uniform1f(u_Pow, Number(event.currentTarget.value))
  }

  function mouseMove(event: MouseEvent) {
    gl.uniform2f(u_Pos1, event.x / canvas.clientWidth, (canvas.clientHeight - event.y) / canvas.clientHeight)
  }

  let period = 2

  function mouseClick(event: MouseEvent) {
    gl.uniform2f(period === 2 ? u_Pos2 : u_Pos3, event.x / canvas.clientWidth, (canvas.clientHeight - event.y) / canvas.clientHeight)
    period = period === 2 ? 3 : 2
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
    canvas.addEventListener('click', mouseClick)
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
      </div>,
      controls
    )
  }

  function clear() {
    canvas.removeEventListener('mousemove', mouseMove)
    canvas.removeEventListener('click', mouseClick)
    done = true

    controlParent.removeChild(controls)
  }

  return {
    init,
    createControls,
    clear
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

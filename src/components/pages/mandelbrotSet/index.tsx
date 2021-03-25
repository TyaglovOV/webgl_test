import { getContext, setCanvasToFullScreen } from '../../../utils/utils';
import { VertexShader } from '../../../shaders/vertexShader';
import { textureLesson1Shaders } from './shaders';
import { FragmentShader } from '../../../shaders/fragmentShader';
import { Program } from '../../../programs/program';
import ReactDOM from 'react-dom'
import { FormEvent } from 'react'

function createDots (): number[] {
  const dots: number[] = [
    -10, -10, 0,
    10, -10, 0,
    10, 10, 0,

    -10, -10, 0,
    10, 10, 0,
    -10, 10, 0
  ]

  return dots
}

export function mandelbrotSet(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)
  const controls = document.createElement('div')

  let needToRecalc = true

  const gl = getContext(canvas)

  const shaders = [
    new VertexShader(gl, textureLesson1Shaders[0]),
    new FragmentShader(gl, textureLesson1Shaders[1])
  ]

  const program = new Program(gl, shaders[0], shaders[1])
  program.use()

  gl.clearColor(1, 1, 1,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // вершины прямоугольника
  let trianglesVertex = createDots()

  // создаем буфер
  const trianglesBuffer = gl.createBuffer()
  // биндим буфер в видеокарте, теперь запись идет туда
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBuffer)

  // закладываем данные в наш буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trianglesVertex), gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')

  const u_canvasSize = gl.getUniformLocation(program.program, 'u_canvasSize')
  const u_zoom = gl.getUniformLocation(program.program, 'u_zoom')
  const u_offset = gl.getUniformLocation(program.program, 'u_offset')
  const u_shades = gl.getUniformLocation(program.program, 'u_shades')

  // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели
  gl.enableVertexAttribArray(a_Position)

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clearDepth(1.0)

  let done = false
  let zoom = 0.25
  let offsetX = 0
  let offsetY = 0
  let shades = 0

  gl.uniform2f(u_canvasSize, canvas.clientWidth, canvas.clientHeight)
  gl.uniform1f(u_zoom, zoom)
  gl.uniform1i(u_shades, shades)
  gl.uniform2f(u_offset, offsetX, offsetY)

  function animate (time: number) {
    if (done) {
      return
    }

    gl.clear(gl.COLOR_BUFFER_BIT)

    if (needToRecalc) {
      gl.uniform1f(u_zoom, zoom)
      gl.uniform2f(u_offset, offsetX, offsetY)
      gl.uniform1i(u_shades, shades)

      needToRecalc = false
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 3, 0)

    gl.drawArrays(gl.TRIANGLES, 0, trianglesVertex.length / 3)
    gl.flush()

    requestAnimationFrame(animate)
  }

  let clicked = false

  function mouseWheel(event: WheelEvent) {
    const delta = event.deltaY

    if (delta > 0) {
      zoom *= 1.05
    } else {
      zoom /= 1.05
    }

    needToRecalc = true
  }

  let lastY = 0
  let lastX = 0

  function mouseDown(event: MouseEvent) {
    clicked = true

    lastX = event.x
    lastY = event.y
  }

  function mouseUp() {
    clicked = false
  }

  function mouseMove(event: MouseEvent) {
    if (clicked) {
      const coordX = event.x
      const coordY = event.y

      const deltaX = coordX - lastX
      const deltaY = coordY - lastY

      lastX = coordX
      lastY = coordY

      offsetX += deltaX * 2 / zoom
      offsetY -= deltaY * 2 / zoom

      needToRecalc = true
    }
  }

  function changeShades(event: FormEvent) {
    shades = 0

    //@ts-ignore
    if (event.target.checked) {
      shades = 1
    }

    needToRecalc = true
  }

  function init() {
    animate(0)

    canvas.addEventListener('wheel', mouseWheel)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup', mouseUp)
    canvas.addEventListener('mouseleave', mouseUp)
    canvas.addEventListener('mousemove', mouseMove)
  }

  function createControls() {
    controlParent.appendChild(controls)

    ReactDOM.render(
      <div>
        <div>
          <label htmlFor="shades">black and white</label>
          <input onChange={changeShades} type="checkbox" id="shades" />
        </div>
      </div>,
      controls
    )
  }

  function clear() {
    done = true

    canvas.removeEventListener('wheel', mouseWheel)
    canvas.removeEventListener('mousedown', mouseDown)
    canvas.removeEventListener('mouseup', mouseUp)
    canvas.removeEventListener('mouseleave', mouseUp)
    canvas.removeEventListener('mousemove', mouseMove)
    controlParent.removeChild(controls)
  }

  return {
    init,
    createControls,
    clear
  }
}

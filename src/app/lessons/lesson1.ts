import { getContext, setCanvasToFullScreen } from '../utils'
import { fragVars, initialShaders, verVars } from '../shadersData/initial'
import { Program } from '../programs/program'
import { VertexShader } from '../shaders/vertexShader'
import { FragmentShader } from '../shaders/fragmentShader'


const rows = 20
const cols = 20

export function startApp(canvas: HTMLCanvasElement) {
  setCanvasToFullScreen(canvas)
  const gl = getContext(canvas)

  // to initialize START

  const shaders = [
    new VertexShader(gl, initialShaders[0]),
    new FragmentShader(gl, initialShaders[1])
  ]

  const program = new Program(gl, shaders[0], shaders[1])

  // ссылка на attribute переменную, чтобы установить ей значение
  const positionAttributeLocation = gl.getAttribLocation(program.program, verVars.posAttr)
  // ссылка на uniform переменную, чтобы установить ей значение
  const resolutionUniformLocation = gl.getUniformLocation(program.program, verVars.resUni)
  // ссылка на переменную цвета
  const colorUniformLocation = gl.getUniformLocation(program.program, fragVars.colorUni)

  const positionBuffer = gl.createBuffer()

  // const positions = [
  //   10, 20,
  //   80, 20,
  //   10, 30,
  //   10, 30,
  //   80, 20,
  //   80, 30,
  // ]
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // to initialize END

  // start using program
  gl.useProgram(program.program)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  // Привязываем буфер положений
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  gl.clearColor(1,1,1, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.lineWidth(1)

  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  const size = 2          // 2 компоненты на итерацию
  const type = gl.FLOAT   // наши данные - 32-битные числа с плавающей точкой
  const normalize = false // не нормализовать данные
  const stride = 0        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  const offset = 0       // начинать с начала буфера
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
  update()

  function update() {
    drawLines(gl, colorUniformLocation)
    // drawRectangles(gl, colorUniformLocation)
    // requestAnimationFrame(update)
  }
}

function drawLines(gl: WebGLRenderingContext, colorUniformLocation: WebGLUniformLocation) {
  gl.clearColor(1,1,1, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const arr: number[] = []

  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < cols; k++) {
      // @ts-ignore
      addLinesToArray(arr, i * 50, k * 50, 40)
    }
  }

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(arr),
    gl.STATIC_DRAW
  )

  gl.uniform4f(colorUniformLocation, 0, 0, 0, 1)
  gl.drawArrays(gl.LINES, 0, 2 * rows * cols)
}

let linesCell = 0
const y1Point = 400
const x1Point = 300

function addLinesToArray(arr: number[], xCoord: number, yCoord: number, length: number) {
  arr[linesCell] = xCoord
  arr[linesCell + 1] = yCoord

  const xOb = x1Point - xCoord
  const yOb = y1Point - yCoord
  const zOb = Math.sqrt(xOb ** 2 + yOb ** 2)

  arr[linesCell + 2] = xCoord + length * xOb / zOb
  arr[linesCell + 3] = yCoord + length * yOb / zOb

  linesCell += 4
}

function drawRectangles(gl: WebGLRenderingContext, colorUniformLocation: WebGLUniformLocation) {
  const rows = 20
  const cols = 20

  gl.clearColor(1,1,1, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const arrr: number[] = []

  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < cols; k++) {
      // @ts-ignore
      addDataToArray(arrr, i * 50, k * 50, 40, 40)
    }
  }

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(arrr),
    gl.STATIC_DRAW
  )

  gl.uniform4f(colorUniformLocation, 0, 0, 0, 1)
  gl.drawArrays(gl.TRIANGLES, 0, 6 * rows * cols)
}

let cell = 0

// @ts-ignore
function addDataToArray(arr, xCoord, yCoord, width, height) {
  const x1 = xCoord
  const x2 = x1 + width
  const y1 = yCoord
  const y2 = y1 + height

  arr[cell] = x1
  arr[cell + 1] = y1
  arr[cell + 2] = x2
  arr[cell + 3] = y1
  arr[cell + 4] = x1
  arr[cell + 5] = y2
  arr[cell + 6] = x1
  arr[cell + 7] = y2
  arr[cell + 8] = x2
  arr[cell + 9] = y1
  arr[cell + 10] = x2
  arr[cell + 11] = y2

  cell += 12
}

function setRectanglesToBufferData(gl: WebGLRenderingContext, xCoord: number, yCoord: number, width: number, height: number) {
  // const x1 = randomInt(300)
  // const x2 = x1 + randomInt(300)
  // const y1 = randomInt(300)
  // const y2 = y1 + randomInt(300)

  const x1 = xCoord
  const x2 = x1 + width
  const y1 = yCoord
  const y2 = y1 + height

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
      // x1, y1,
      // x2, y1,
      // x1, y2,
      // x1, y2,
      // x2, y1,
      // x2, y2
    ]),
    gl.STATIC_DRAW
  )
}

function randomInt(range: number) {
  return Math.floor(Math.random() * range);
}



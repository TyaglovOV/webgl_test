import { getContext, setCanvasToFullScreen } from './utils'
import { fragVars, initialShaders, verVars } from './shadersData/initial'
import { Program } from './programs/program'
import { VertexShader } from './shaders/vertexShader'
import { FragmentShader } from './shaders/fragmentShader'


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

}



function randomInt(range: number) {
  return Math.floor(Math.random() * range);
}



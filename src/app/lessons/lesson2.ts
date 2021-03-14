import { getContext, setCanvasToFullScreen } from '../utils'
import { lesson2 } from '../shadersData/lesson2'
import { Program } from '../programs/program'
import { VertexShader } from '../shaders/vertexShader'
import { FragmentShader } from '../shaders/fragmentShader'

export function startApp(canvas: HTMLCanvasElement) {
  setCanvasToFullScreen(canvas)
  const gl = getContext(canvas)

  // to initialize START
  const shaders = [
    new VertexShader(gl, lesson2[0]),
    new FragmentShader(gl, lesson2[1])
  ]

  const program = new Program(gl, shaders[0], shaders[1])
  program.use()
  
  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const a_PointSize = gl.getAttribLocation(program.program, 'a_PointSize')

  gl.vertexAttrib1f(a_PointSize, 100.0)
  gl.vertexAttrib3f(a_Position, 0, 0, 0)

  gl.clearColor(1,1,1,1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)
}

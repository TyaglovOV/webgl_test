import {
  createDoubleFrameBuffer,
  drawToDoubleFramebuffer,
  getContext,
  setCanvasToFullScreen
} from '../../../utils/utils';
import { lifeShaders } from './shaders'
import { VertexShader } from '../../../shaders/vertexShader'
import { FragmentShader } from '../../../shaders/fragmentShader'
import { Program } from '../../../programs/program'
import { figures } from '../../../utils/figures'

export function particlesTry1(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)
  const pointsCount = 100

  const gl = getContext(canvas)

  const program = new Program(gl, new VertexShader(gl, lifeShaders[0]), new FragmentShader(gl, lifeShaders[1]))
  program.use()

  gl.clearColor(1,1,1,0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const a_texCoord = gl.getAttribLocation(program.program, 'a_texCoord')
  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const a_pointCoord = gl.getAttribLocation(program.program, 'a_pointCoord')
  
  const u_textureSize = gl.getUniformLocation(program.program, 'u_textureSize')
  const u_seed = gl.getUniformLocation(program.program, 'u_seed')

  const dfbo = createDoubleFrameBuffer({ gl, width: canvas.clientWidth, height: canvas.clientHeight })

  const positionBuffer =  gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.flatPlane.vertices()), gl.STATIC_DRAW)

  const texcoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.flatPlane.texCoords()), gl.STATIC_DRAW)

  const pointsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.points.verticesRandom(pointsCount)), gl.STATIC_DRAW)

  gl.enableVertexAttribArray(a_Position)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 2, 0)

  gl.enableVertexAttribArray(a_texCoord)
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 4 * 2, 0)
  
  // gl.enableVertexAttribArray(a_pointCoord)
  // gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer)
  // gl.vertexAttribPointer(a_pointCoord, 2, gl.FLOAT, false, 4 * 2, 0)

  let done = false
  let seed = 0

  function animate (time: number) {
    if (done) {
      return
    }

    setCanvasToFullScreen(canvas)

    gl.uniform2f(u_textureSize, canvas.clientWidth, canvas.clientHeight)
    //
    // if (seed < 2) {
    //   gl.uniform1f(u_seed,  seed)
    //   seed++
    // } else {
    //   gl.uniform1f(u_seed,  0)
    // }

    drawToDoubleFramebuffer({ gl, dfbo, width: canvas.clientWidth, height: canvas.clientHeight, draw })

    finalDraw()

    requestAnimationFrame(animate)
  }

  function draw () {
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  function finalDraw() {
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  function init() {
    animate(0)
  }

  function createControls() {}

  function clear() {
    done = true
  }

  return {
    init,
    createControls,
    clear
  }
}

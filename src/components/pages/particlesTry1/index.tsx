import {
  createFrameBuffer,
  drawToFramebuffer,
  getContext,
  setCanvasToFullScreen
} from '../../../utils/utils';
import { particlesShader } from './particlesShader'
import { trackShader as copyShader } from './trackShader'
import { fadeShader } from './fadeShader'
import { Program } from '../../../programs/program'
import { figures } from '../../../utils/figures'

export function particlesTry1(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)
  const pointsCount = 5000

  const gl = getContext(canvas)

  const particlesProgram = new Program(gl, particlesShader)
  const fadeProgram = new Program(gl, fadeShader)
  const copyProgram = new Program(gl, copyShader)

  gl.clearColor(0,0,0,0.99)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const a_pointCoord = gl.getAttribLocation(particlesProgram.program, 'a_pointCoord')
  const u_time = gl.getUniformLocation(particlesProgram.program, 'u_time')

  const a_texCoord = gl.getAttribLocation(fadeProgram.program, 'a_texCoord')
  const a_position = gl.getAttribLocation(fadeProgram.program, 'a_position')
  const particleFb = createFrameBuffer({ gl, width: canvas.clientWidth, height: canvas.clientHeight })

  // todo optimize, concat arrays
  const positionBuffer =  gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.flatPlane.vertices()), gl.STATIC_DRAW)

  const texcoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.flatPlane.texCoords()), gl.STATIC_DRAW)

  const pointsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.points.verticesRandom(pointsCount * 2)), gl.STATIC_DRAW)

  let done = false

  function animate (time: number) {
    if (done) {
      return
    }

    setCanvasToFullScreen(canvas)

    particlesProgram.use()
    gl.uniform1f(u_time, time)

    gl.enableVertexAttribArray(a_pointCoord)
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer)
    gl.vertexAttribPointer(a_pointCoord, 4, gl.FLOAT, false, 4 * 4, 0)

    drawToFramebuffer({ gl, fb: particleFb, width: canvas.clientWidth, height: canvas.clientHeight,
      draw: () => gl.drawArrays(gl.POINTS, 0, pointsCount)
    })

    copyProgram.use()
    gl.enableVertexAttribArray(a_position)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 4 * 2, 0)

    gl.enableVertexAttribArray(a_texCoord)
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 4 * 2, 0)

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    requestAnimationFrame(animate)
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

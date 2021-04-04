import {
  createDoubleFrameBuffer, drawToDoubleFramebuffer,
  getContext, makeBuffer,
  setCanvasToFullScreen
} from '../../../utils/utils'
import { particlesShader } from './particlesShader'
import { pathFindingTFShader } from './pathFindingTFShader'
import { fadeShader } from './fadeShader'
import { Program } from '../../../programs/program'
import { figures } from '../../../utils/figures';
import { blurKernel, computeKernelWeight } from '../../../utils/imageProcessing'

export function slime(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)

  const gl = getContext(canvas)

  const program = {
    pathFindingTF: new Program(gl, pathFindingTFShader, {
      transfromFeedbackAttributes: gl.SEPARATE_ATTRIBS, transfromFeedbackVaryings: ['newPosition', 'newDirection']
    }),
    particles: new Program(gl, particlesShader),
    fade: new Program(gl, fadeShader)
  }

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const pathFindingLocs = {
    oldPosition: gl.getAttribLocation(program.pathFindingTF.program, 'oldPosition'),
    oldDirection: gl.getAttribLocation(program.pathFindingTF.program, 'oldDirection'),
    velocity: gl.getAttribLocation(program.pathFindingTF.program, 'velocity'),
    u_step: gl.getUniformLocation(program.pathFindingTF.program, 'u_step'),
    u_canvasDimensions: gl.getUniformLocation(program.pathFindingTF.program, 'u_canvasDimensions')
  }

  const particlesLocs = {
    position: gl.getAttribLocation(program.particles.program, 'position'),
    matrix: gl.getUniformLocation(program.particles.program, 'u_matrix'),
  }

  const fadeLocs = {
    a_texCoord: gl.getAttribLocation(program.fade.program, 'a_texCoord'),
    a_position: gl.getAttribLocation(program.fade.program, 'a_position'),

    u_textureSize: gl.getUniformLocation(program.fade.program, 'u_textureSize'),
    kernel: gl.getUniformLocation(program.fade.program, "u_kernel[0]"),
    kernelWeight: gl.getUniformLocation(program.fade.program, "u_kernelWeight")
  }

  const numParticles = 200

  const positions = new Float32Array(figures.points.rangeRandom(numParticles, [[0, canvas.width], [0, canvas.height]]))
  const velocities = new Float32Array(figures.points.rangeRandom(numParticles, [[-300, 300], [-300, 300]]))
  const directions = new Float32Array(figures.points.verticesRandom(numParticles))
  const positionPlane = new Float32Array(figures.flatPlane.vertices())
  const texCoordPlane = new Float32Array(figures.flatPlane.texCoords())

  const position1Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW)
  const position2Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW)
  const direction1Buffer = makeBuffer(gl, directions, gl.DYNAMIC_DRAW)
  const direction2Buffer = makeBuffer(gl, directions, gl.DYNAMIC_DRAW)

  const positionBuffer =  makeBuffer(gl, positionPlane, gl.DYNAMIC_DRAW)
  const texcoordBuffer = makeBuffer(gl, texCoordPlane, gl.DYNAMIC_DRAW)

  const velocityBuffer = makeBuffer(gl, velocities, gl.STATIC_DRAW)

  //@ts-ignore
  function makeVertexArray(gl: WebGL2RenderingContext, bufLocPairs) {
    const va = gl.createVertexArray();
    gl.bindVertexArray(va);
    for (const [buffer, loc] of bufLocPairs) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(
        loc,      // attribute location
        2,        // number of elements
        gl.FLOAT, // type of data
        false,    // normalize
        0,        // stride (0 = auto)
        0,        // offset
      )
    }
    return va;
  }

  const updatePositionVA1 = makeVertexArray(gl, [
    [position1Buffer, pathFindingLocs.oldPosition],
    [direction1Buffer, pathFindingLocs.oldDirection],
    [velocityBuffer, pathFindingLocs.velocity],
  ])

  const updatePositionVA2 = makeVertexArray(gl, [
    [position2Buffer, pathFindingLocs.oldPosition],
    [direction2Buffer, pathFindingLocs.oldDirection],
    [velocityBuffer, pathFindingLocs.velocity],
  ])

  const drawVA1 = makeVertexArray(gl, [[position1Buffer, particlesLocs.position]])
  const drawVA2 = makeVertexArray(gl, [[position2Buffer, particlesLocs.position]])
  const fadeDraw = makeVertexArray(gl, [
    [positionBuffer, fadeLocs.a_position],
    [texcoordBuffer, fadeLocs.a_texCoord]
  ])

  function makeTransformFeedback(gl: WebGL2RenderingContext, buffer: WebGLBuffer | null, buffer2: WebGLBuffer | null) {
    const tf = gl.createTransformFeedback()
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, buffer2)

    return tf
  }

  const tf1 = makeTransformFeedback(gl, position1Buffer, direction1Buffer)
  const tf2 = makeTransformFeedback(gl, position2Buffer, direction2Buffer)

  // unbind left over stuff
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)

  let current = {
    updateVA: updatePositionVA1,  // read from position1
    tf: tf2,                      // write to position2
    drawVA: drawVA2,              // draw with position2
  }
  let next = {
    updateVA: updatePositionVA2,  // read from position2
    tf: tf1,                      // write to position1
    drawVA: drawVA1,              // draw with position1
  }

  let done = false
  let count = 0

  //@ts-ignore
  function orthographic(left, right, bottom, top, near, far, dst) {
    dst = dst || new Float32Array(16);

    dst[0] = 2 / (right - left);
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 0;
    dst[5] = 2 / (top - bottom);
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  }

  const dfbo = createDoubleFrameBuffer({ gl, width: canvas.clientWidth, height: canvas.clientHeight })
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  function animate(time: number) {
    if (done) {
      return
    }

    setCanvasToFullScreen(canvas)
    gl.clear(gl.COLOR_BUFFER_BIT)

    program.pathFindingTF.use()
    gl.bindVertexArray(current.updateVA)
    gl.uniform1f(pathFindingLocs.u_step, count)
    gl.uniform2f(pathFindingLocs.u_canvasDimensions, gl.canvas.width, gl.canvas.height)

    gl.enable(gl.RASTERIZER_DISCARD)

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tf)
    gl.beginTransformFeedback(gl.POINTS)
    gl.drawArrays(gl.POINTS, 0, numParticles)
    gl.endTransformFeedback()
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

    // turn on using fragment shaders again
    gl.disable(gl.RASTERIZER_DISCARD);

    // now draw the particles.
    program.particles.use()
    gl.bindVertexArray(current.drawVA)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.uniformMatrix4fv(
      particlesLocs.matrix,
      false,
      //@ts-ignore
      orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1))

    drawToDoubleFramebuffer({ gl, dfbo, width: canvas.clientWidth, height: canvas.clientHeight,
      draw: () => gl.drawArrays(gl.POINTS, 0, numParticles)
    })

    {
      const temp = current;
      current = next;
      next = temp;
    }

    program.fade.use()
    gl.uniform1fv(fadeLocs.kernel, blurKernel)
    gl.uniform1f(fadeLocs.kernelWeight, computeKernelWeight(blurKernel))
    gl.uniform2f(fadeLocs.u_textureSize, canvas.clientWidth, canvas.clientHeight)

    gl.bindVertexArray(fadeDraw)

    drawToDoubleFramebuffer({ gl, dfbo, width: canvas.clientWidth, height: canvas.clientHeight,
      draw: () => gl.drawArrays(gl.TRIANGLES, 0, 6)
    })

    drawToDoubleFramebuffer({ gl, dfbo, width: canvas.clientWidth, height: canvas.clientHeight,
      draw: () => gl.drawArrays(gl.TRIANGLES, 0, 6)
    })

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    count++
    requestAnimationFrame(animate)
  }

  function init() {
    animate(0)
  }

  function createControls() {
  }

  function clear() {
    done = true
  }

  return {
    init,
    createControls,
    clear
  }
}

import {
  createDoubleFrameBuffer, createFrameBuffer,
  drawToDoubleFramebuffer, drawToFramebuffer,
  getContext,
  setCanvasToFullScreen
} from '../../../utils/utils';
import { particlesShader } from './particlesShader'
import { trackShader as copyShader } from './trackShader'
import { fadeShader } from './fadeShader'
import { VertexShader } from '../../../shaders/vertexShader'
import { FragmentShader } from '../../../shaders/fragmentShader'
import { Program } from '../../../programs/program'
import { figures } from '../../../utils/figures'

export function blur(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)
  const pointsCount = 10000
  const edgeDetectKernel = [
    1, 2, 1,
    2, 4, 2,
    1, 2, 1
  ];

  const gl = getContext(canvas)

  const particlesProgram = new Program(gl, new VertexShader(gl, particlesShader[0]), new FragmentShader(gl, particlesShader[1]))
  const fadeProgram = new Program(gl, new VertexShader(gl, fadeShader[0]), new FragmentShader(gl, fadeShader[1]))
  const copyProgram = new Program(gl, new VertexShader(gl, copyShader[0]), new FragmentShader(gl, copyShader[1]))

  gl.clearColor(0,0,0,0.99)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const a_pointCoord = gl.getAttribLocation(particlesProgram.program, 'a_pointCoord')
  const u_time = gl.getUniformLocation(particlesProgram.program, 'u_time')

  const a_texCoord = gl.getAttribLocation(fadeProgram.program, 'a_texCoord')
  const a_position = gl.getAttribLocation(fadeProgram.program, 'a_position')
  const u_textureSize = gl.getUniformLocation(fadeProgram.program, 'u_textureSize')

  var kernelLocation = gl.getUniformLocation(fadeProgram.program, "u_kernel[0]");
  var kernelWeightLocation = gl.getUniformLocation(fadeProgram.program, "u_kernelWeight")
  const dfbo = createDoubleFrameBuffer({ gl, width: canvas.clientWidth, height: canvas.clientHeight })

  // todo optimize, concat arrays
  const positionBuffer =  gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.flatPlane.vertices()), gl.STATIC_DRAW)

  const texcoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.flatPlane.texCoords()), gl.STATIC_DRAW)

  const pointsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figures.points.verticesRandom(pointsCount)), gl.STATIC_DRAW)

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
    gl.vertexAttribPointer(a_pointCoord, 4, gl.FLOAT, false, 2 * 4, 0)

    drawToDoubleFramebuffer({ gl, dfbo, width: canvas.clientWidth, height: canvas.clientHeight,
      draw: () => gl.drawArrays(gl.POINTS, 0, pointsCount)
    })

    gl.enableVertexAttribArray(a_position)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 4 * 2, 0)

    gl.enableVertexAttribArray(a_texCoord)
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 4 * 2, 0)

    fadeProgram.use()
    gl.uniform1fv(kernelLocation, edgeDetectKernel);
    gl.uniform1f(kernelWeightLocation, computeKernelWeight(edgeDetectKernel));
    gl.uniform2f(u_textureSize, canvas.clientWidth, canvas.clientHeight)

    drawToDoubleFramebuffer({ gl, dfbo, width: canvas.clientWidth, height: canvas.clientHeight,
      draw: () => gl.drawArrays(gl.TRIANGLES, 0, 6)
    })

    drawToDoubleFramebuffer({ gl, dfbo, width: canvas.clientWidth, height: canvas.clientHeight,
      draw: () => gl.drawArrays(gl.TRIANGLES, 0, 6)
    })

    copyProgram.use()

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    requestAnimationFrame(animate)
  }

  function computeKernelWeight(kernel: number[]) {
    const weight = kernel.reduce(function(prev, curr) {
      return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
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

import {
  createTextureForFrameBuffer,
  getContext,
  setCanvasToFullScreen
} from '../../../utils/utils';
import { tryToSwapShaders2 } from './shaders2'
import { Program } from '../../../programs/program'

function createDots (): number[] {
  const dots: number[] = [
    -1, -1,
    1, -1,
    1, 1,

    -1, -1,
    1, 1,
    -1, 1,
  ]

  return dots
}

export function tryToSwapTextures(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)

  const gl = getContext(canvas)

  const program = new Program(gl, tryToSwapShaders2)
  program.use()

  gl.clearColor(0,0,0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const positionBuffer =  gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(createDots()), gl.STATIC_DRAW)

  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ]), gl.STATIC_DRAW);

  const a_texCoord = gl.getAttribLocation(program.program, 'a_texCoord')
  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const u_line = gl.getUniformLocation(program.program, 'u_line')
  const u_line2 = gl.getUniformLocation(program.program, 'u_line2')

  const textures: WebGLTexture[] = []
  const fbs: WebGLFramebuffer[] = []

  for (let i = 0; i < 2; i++) {
    const texture = createTextureForFrameBuffer({ gl, width: canvas.clientWidth, height: canvas.clientHeight })
    texture && textures.push(texture)

    const fbo = gl.createFramebuffer()
    fbo && fbs.push(fbo)

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  }

  let done = false
  let ccc = 0

  function animate (time: number) {
    if (done) {
      return
    }

    setCanvasToFullScreen(canvas)

    // gl.clear(gl.COLOR_BUFFER_BIT);

    // Turn on the position attribute
    gl.enableVertexAttribArray(a_Position)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 2, 0)

    // Turn on the position attribute
    gl.enableVertexAttribArray(a_texCoord)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 4 * 2, 0)
    gl.uniform1f(u_line2,  2 * (ccc + Math.floor(canvas.clientWidth / 3)) % canvas.clientWidth)
    gl.uniform1f(u_line, (4 * ccc) % canvas.clientWidth)

    let count = 0

    // gl.bindTexture(gl.TEXTURE_2D, textures[1])

    for (let i = 0; i < 2; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[count % 2])
      gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.bindTexture(gl.TEXTURE_2D, textures[count % 2])
      gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)

      count++
    }

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // Tell webgl the viewport setting needed for framebuffer.
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    ccc++
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

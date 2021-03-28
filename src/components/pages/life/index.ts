import {
  createDoubleFrameBuffer, createTextureForFrameBuffer,
  getContext,
  setCanvasToFullScreen
} from '../../../utils/utils';
import { lifeShaders } from './shaders'
import { VertexShader } from '../../../shaders/vertexShader'
import { FragmentShader } from '../../../shaders/fragmentShader'
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

export function life(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)

  const gl = getContext(canvas)

  const shaders2 = [
    new VertexShader(gl, lifeShaders[0]),
    new FragmentShader(gl, lifeShaders[1])
  ]

  const program = new Program(gl, shaders2[0], shaders2[1])
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
  const u_textureSize = gl.getUniformLocation(program.program, 'u_textureSize')
  const u_line = gl.getUniformLocation(program.program, 'u_line')
  const u_seed = gl.getUniformLocation(program.program, 'u_seed')

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
  let seed = 0

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

    gl.uniform2f(u_textureSize, canvas.clientWidth, canvas.clientHeight)

    if (seed < 2) {
      gl.uniform1f(u_seed,  seed)
      seed++
    } else {
      gl.uniform1f(u_seed,  0)
    }

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

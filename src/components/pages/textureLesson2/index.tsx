import { createTextureRenderBuffer, getContext, getTexture, setCanvasToFullScreen } from '../../../utils/utils';
import { VertexShader } from '../../../shaders/vertexShader';
import { textureLesson1Shaders } from './shaders';
import { FragmentShader } from '../../../shaders/fragmentShader';
import { Program } from '../../../programs/program';
import { mat4 } from 'gl-matrix'
import smile from './smile.jpeg'

function createDots (): number[] {
  const dots: number[] = [
    -1, -1, -1,     -0.5, -0.5,
     1, -1, -1,     1.5, -0.5,
     1,  1, -1,     1.5, 1.5,
    -1, -1, -1,     -0.5, -0.5,
     1,  1, -1,     1.5, 1.5,
    -1,  1, -1,     -0.5, 1.5,

    -1, -1,  1,     -0.5, -0.5,
     1, -1,  1,     1.5, -0.5,
     1,  1,  1,     1.5, 1.5,
    -1, -1,  1,     -0.5, -0.5,
     1,  1,  1,     1.5, 1.5,
    -1,  1,  1,     -0.5, 1.5,

    -1, -1, -1,     -0.5, -0.5,
    -1,  1, -1,     1.5, -0.5,
    -1,  1,  1,     1.5, 1.5,
    -1, -1, -1,     -0.5, -0.5,
    -1,  1,  1,     1.5, 1.5,
    -1, -1,  1,     -0.5, 1.5,

     1, -1, -1,     -0.5, -0.5,
     1,  1, -1,     1.5, -0.5,
     1,  1,  1,     1.5, 1.5,
     1, -1, -1,     -0.5, -0.5,
     1,  1,  1,     1.5, 1.5,
     1, -1,  1,     -0.5, 1.5,

    -1, -1, -1,     -0.5, -0.5,
    -1, -1,  1,     1.5, -0.5,
     1, -1,  1,     1.5, 1.5,
    -1, -1, -1,     -0.5, -0.5,
     1, -1,  1,     1.5, 1.5,
     1, -1, -1,     -0.5, 1.5,

    -1,  1, -1,     -0.5, -0.5,
    -1,  1,  1,     1.5, -0.5,
     1,  1,  1,     1.5, 1.5,
    -1,  1, -1,     -0.5, -0.5,
     1,  1,  1,     1.5, 1.5,
     1,  1, -1,     -0.5, 1.5,
  ]

  return dots
}

export function textureLesson2(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)

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

  // вершины куба
  let trianglesVertex = createDots()

  // создаем буфер
  const trianglesBuffer = gl.createBuffer()
  // биндим буфер в видеокарте, теперь запись идет туда
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBuffer)
  // закладываем данные в наш буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trianglesVertex), gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const a_uv = gl.getAttribLocation(program.program, 'a_uv')
  const u_sampler = gl.getUniformLocation(program.program, 'u_sampler')

  gl.uniform1i(u_sampler, 0)

  const u_Pmatrix = gl.getUniformLocation(program.program, 'u_Pmatrix')
  const u_Mmatrix = gl.getUniformLocation(program.program, 'u_Mmatrix')
  const u_Vmatrix = gl.getUniformLocation(program.program, 'u_Vmatrix')

  const modelMatrix = mat4.create()
  mat4.identity(modelMatrix)

  const viewMatrix = mat4.create()
  mat4.identity(viewMatrix)

  let projectionMatrix = mat4.create()
  projectionMatrix = mat4.perspective(projectionMatrix, 90, canvas.clientWidth / canvas.clientHeight, 0.01, Infinity)
  mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -2])

  // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели
  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_uv)

  const texture = getTexture(gl, smile)

  // процесс рендера в текстуру
  // создаем фреймбуффер, в него кладем кадр
  const fb = gl.createFramebuffer()
  // биндим фб как активный для испольщования
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

  //рендер буффер, это результирующее (?) изображение
  const rb = gl.createRenderbuffer()
  gl.bindRenderbuffer(gl.RENDERBUFFER, rb)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512)

  const textureRenderBuffer = createTextureRenderBuffer(gl, rb, 0)

  gl.bindRenderbuffer(gl.RENDERBUFFER,null)
  gl.bindFramebuffer(gl.FRAMEBUFFER,null)

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clearDepth(1.0)

  let done = false

  function animate (time: number) {
    if (done) {
      return
    }

    // ррррряяяяяяяяяндерим в текстуру
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb)

    // для нашей текстуры чистим окружение, устанавливаем размеры cntgtyb 2
    gl.viewport(0,0,512,512)
    gl.clearColor(0.2,0.2,0.2,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

    mat4.rotateX(modelMatrix,modelMatrix,0.0005*1);
    mat4.rotateZ(modelMatrix,modelMatrix,0.0003*1);
    mat4.rotateY(modelMatrix,modelMatrix,0.0007*1);

    gl.uniformMatrix4fv(u_Pmatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(u_Mmatrix, false, modelMatrix)
    gl.uniformMatrix4fv(u_Vmatrix, false, viewMatrix)

    if (texture.webglTexture) {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture.webglTexture)
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 5, 0)
    gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 4 * 5, 4 * 3)

    gl.drawArrays(gl.TRIANGLES, 0, trianglesVertex.length / 5)

    gl.bindTexture(gl.TEXTURE_2D,null)

    // рендерим финалочку
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    // gl.viewport(0,0,512,512)

    mat4.rotateX(modelMatrix,modelMatrix,0.0005*1);
    mat4.rotateZ(modelMatrix,modelMatrix,0.0003*1);
    mat4.rotateY(modelMatrix,modelMatrix,0.0007*1);

    gl.uniformMatrix4fv(u_Pmatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(u_Mmatrix, false, modelMatrix)
    gl.uniformMatrix4fv(u_Vmatrix, false, viewMatrix)

    gl.clearColor(1,1,1,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

    gl.bindTexture(gl.TEXTURE_2D,textureRenderBuffer);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 5, 0)
    gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 4 * 5, 4 * 3)

    gl.drawArrays(gl.TRIANGLES, 0, trianglesVertex.length / 5)

    gl.flush()

    requestAnimationFrame(animate)
  }

  let clicked = false
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

      mat4.rotateY(modelMatrix, modelMatrix, deltaX / 100)
      mat4.rotateX(modelMatrix, modelMatrix, deltaY / 100)

      lastX = coordX
      lastY = coordY
      needToRecalc = true
    }
  }

  function init() {
    animate(0)

    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup', mouseUp)
    canvas.addEventListener('mouseleave', mouseUp)
    canvas.addEventListener('mousemove', mouseMove)
  }

  function createControls() {

  }

  function clear() {
    done = true

    canvas.removeEventListener('mousedown', mouseDown)
    canvas.removeEventListener('mouseup', mouseUp)
    canvas.removeEventListener('mouseleave', mouseUp)
    canvas.removeEventListener('mousemove', mouseMove)
  }

  return {
    init,
    createControls,
    clear
  }
}

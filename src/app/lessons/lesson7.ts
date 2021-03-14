import { getContext, setCanvasToFullScreen } from '../utils'
import { lesson2 } from '../shadersData/lesson7'
import { Program } from '../programs/program'
import { VertexShader } from '../shaders/vertexShader'
import { FragmentShader } from '../shaders/fragmentShader'
import { mat4, vec3 } from 'gl-matrix'

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

  gl.clearColor(1, 1, 1,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const a_Color = gl.getAttribLocation(program.program, 'a_Color')

  const u_Pmatrix = gl.getUniformLocation(program.program, 'u_Pmatrix')
  const u_Mmatrix = gl.getUniformLocation(program.program, 'u_Mmatrix')
  const u_Vmatrix = gl.getUniformLocation(program.program, 'u_Vmatrix')

  const VIEWMATRIX = mat4.create()
  const MODELMATRIX = mat4.create()

  // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели
  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_Color)

  const triangleVertex = [
    -0.5, -0.5,
    1.0, 0.0, 0.0,
    -0.5, 0.5,
    0.0, 1.0, 0.0,
    0.5, 0.5,
    0.0, 0.0, 1.0,
    0.5, -0.5,
    0.0, 0.0, 1.0,
  ]

  // создаем буфер
  const trianglesVertex = gl.createBuffer()

  // биндим буфер в видеокарте, теперь запись идет туда
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVertex)
  // закладываем данные в наш буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertex), gl.STATIC_DRAW)

  const triangleFaces = [0, 1, 2, 0, 2, 3]
  const trianglesFaces = gl.createBuffer()

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesFaces)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleFaces), gl.STATIC_DRAW)

  let PROJECTIONMATRIX = mat4.create()
  PROJECTIONMATRIX = mat4.perspective(PROJECTIONMATRIX, 90, canvas.width / canvas.height, 0.01, undefined)

  mat4.identity(VIEWMATRIX)
  mat4.translate(PROJECTIONMATRIX, PROJECTIONMATRIX, [0, 0, -10])
  mat4.translate(VIEWMATRIX, VIEWMATRIX,[0, 0, 0]);


  gl.uniformMatrix4fv(u_Pmatrix, false, PROJECTIONMATRIX)
  gl.uniformMatrix4fv(u_Vmatrix, false, VIEWMATRIX)

  function animate (time: number) {
    gl.clear(gl.COLOR_BUFFER_BIT)

    mat4.identity(MODELMATRIX)

    mat4.scale(MODELMATRIX, MODELMATRIX, [1, 1, 1])
    mat4.translate(MODELMATRIX, MODELMATRIX, [0, 0, 0]); //x y z
    mat4.rotateZ(MODELMATRIX, MODELMATRIX, Math.PI * 0.001 * time )

    // записываем в юниформ переменную
    gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * (2 + 3), 0)
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * (2 + 3), 4 * 2)

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

    requestAnimationFrame(animate)
  }

  animate(0)

  // gl.drawArrays(gl.TRIANGLES, 0,3)
}

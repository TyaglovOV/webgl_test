import { getContext, setCanvasToFullScreen } from '../utils'
import { lesson2 } from '../shadersData/vectorField'
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

  const dotsVertex = createDots(100, 10, canvas.width, canvas.height)
  // создаем буфер
  const dotsBuffer = gl.createBuffer()
  // биндим буфер в видеокарте, теперь запись идет туда
  gl.bindBuffer(gl.ARRAY_BUFFER, dotsBuffer)
  // закладываем данные в наш буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsVertex), gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const u_Pos1 = gl.getUniformLocation(program.program, 'u_Pos1')
  const u_Pos2 = gl.getUniformLocation(program.program, 'u_Pos2')
  const u_Shift = gl.getUniformLocation(program.program, 'u_Shift')

  // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели
  gl.enableVertexAttribArray(a_Position)

  gl.uniform1f(u_Pos1, Math.random() * 2 - 1)
  gl.uniform1f(u_Pos2, Math.random() * 2 - 1)


  function animate (time: number) {
    gl.clear(gl.COLOR_BUFFER_BIT)

    // записываем в юниформ переменную
    // gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX)
    gl.uniform1f(u_Shift, time * 0.0001)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 2, 0)

    gl.drawArrays(gl.POINTS, 0, dotsVertex.length / 2)

    requestAnimationFrame(animate)
  }

  animate(0)

  // gl.drawArrays(gl.TRIANGLES, 0,3)
}

function createDots (size: number, padding: number, width: number, height: number): number[] {
  const dots: number[] = []
  let pointer = 0

  for (let i = 0; i < size; i++) {
    for (let k = 0; k < size; k++) {
      addData(i, k)
    }
  }

  function addData(row: number, col: number) {
    dots[pointer] = (col * padding / width ) * 2 - 1  // x1 в нормализованных координатах пространства отсечения от -1.0 до 1.0
    dots[pointer + 1] = (row * padding / height ) * 2 - 1  // y1 в нормализованных координатах пространства отсечения от -1.0 до 1.0
    pointer += 2
  }

  return dots
}

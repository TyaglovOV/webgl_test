import { getContext, setCanvasToFullScreen } from '../utils'
import { lesson2 } from '../shadersData/lesson5'
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

  gl.clearColor(0.5,0.5,0.5,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const a_Color = gl.getAttribLocation(program.program, 'a_Color')

  // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели
  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_Color)

  const triangleVertex = [
    0, 0,
    1.0, 0.0, 0.0,
    0, 1,
    0.0, 1.0, 0.0,
    1, 1,
    0.0, 0.0, 1.0,
    1, 0,
    0.0, 0.0, 1.0,
  ]

  // создаем буфер
  const trianglesVertex = gl.createBuffer()

  // биндим буфер в видеокарте, теперь запись идет туда
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVertex)
  // закладываем данные в наш буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertex), gl.STATIC_DRAW)

  // здесь мы, по сути, объявляем глу, как из буффера брать значения аттрибутов для шейдеров
  // он ходит по буфферу поинтером и читает значения из массива с определенными отступами
  // записывает значения в шейдеры
  // шейдер уже рисует нужные данные
  // аттрибут a_Position, 2 элемента из буффера, тип переменной флоат, false?, с какого байта брать следующий элемент,
  // отступ от началнього элемента в байтах
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * (2 + 3), 0)
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * (2 + 3), 4 * 2)

  const triangleFaces = [0, 1, 2, 0, 2, 3]
  const trianglesFaces = gl.createBuffer()

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesFaces)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleFaces), gl.STATIC_DRAW)
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

  // gl.drawArrays(gl.TRIANGLES, 0,3)
}

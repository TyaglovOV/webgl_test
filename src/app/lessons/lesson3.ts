import { getContext, setCanvasToFullScreen } from '../utils'
import { lesson2 } from '../shadersData/lesson3'
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

  const a_Position = gl.getAttribLocation(program.program, 'a_Position')
  const a_PointSize = gl.getAttribLocation(program.program, 'a_PointSize')
  const u_FragColor = gl.getUniformLocation(program.program, 'u_FragColor')

  gl.vertexAttrib1f(a_PointSize, 100.0)
  gl.uniform4f(u_FragColor, 0.2, 0.2, 0.2, 1)

  const points: number[] = []

  canvas.addEventListener('mousedown', (event) => {
    let mouseX = event.clientX
    let mouseY = event.clientY

    const rect = canvas.getBoundingClientRect();

    mouseX = ((mouseX - rect.left) - canvas.width / 2) / (canvas.width / 2);
    mouseY = ((canvas.height / 2) - (mouseY - rect.top)) / (canvas.height / 2);

    points.push(mouseX)
    points.push(mouseY)

    gl.clear(gl.COLOR_BUFFER_BIT)

    for (let i = 0; i <= points.length; i += 2) {
      gl.vertexAttrib3f(a_Position, points[i], points[i + 1], 0)
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  })

  gl.drawArrays(gl.POINTS, 0, 1)

  // gl.drawArrays(gl.POINTS, 0, 1)
}

// function click(ev, gl, canvas, a_Position) {
//   var x = ev.clientX;
//   var y = ev.clientY;
//
//   g_points.push(x);
//   g_points.push(y);
//
//   console.log('part_3____ x = ' + x + " y = " + y);
//
//   gl.clear(gl.COLOR_BUFFER_BIT);
//
//   var len = g_points.length;
//   for (i = 0; i < len; i += 2) {
//     gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);
//     gl.drawArrays(gl.POINTS, 0, 1);
//   }
// }

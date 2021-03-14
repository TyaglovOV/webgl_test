import { CanvasContext } from '../utils';
import { Shader } from '../shaders/shader';

// привязка шейдериков к программе
export class Program {
  program: WebGLProgram = undefined
  canvasContext: CanvasContext = undefined

  constructor(canvasContext: CanvasContext, vertexShader: Shader, fragmentShader: Shader) {
    const program = canvasContext.createProgram()
    canvasContext.attachShader(program, vertexShader.shader)
    canvasContext.attachShader(program, fragmentShader.shader)
    canvasContext.linkProgram(program)

    const linkStatus = canvasContext.getProgramParameter(program, canvasContext.LINK_STATUS)

    if (linkStatus) {
      this.program = program
      this.canvasContext = canvasContext
      return
    }

    console.log(canvasContext.getProgramInfoLog(program))
    canvasContext.deleteProgram(program)
    throw new Error('program problem, bruh')
  }

  use() {
    this.canvasContext.useProgram(this.program)
  }
}
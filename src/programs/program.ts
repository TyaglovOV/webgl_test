import { CanvasContext } from '../utils/utils';
import { Shader } from '../shaders/shader';

// привязка шейдериков к программе
export class Program {
  _program: WebGLProgram
  _gl: CanvasContext

  constructor(canvasContext: CanvasContext, vertexShader: Shader, fragmentShader: Shader) {
    const program = canvasContext.createProgram()!

    canvasContext.attachShader(program, vertexShader.shader)
    canvasContext.attachShader(program, fragmentShader.shader)
    canvasContext.linkProgram(program)

    const linkStatus = canvasContext.getProgramParameter(program, canvasContext.LINK_STATUS)

    if (linkStatus) {
      this._program = program
      this._gl = canvasContext
      return
    }

    console.log(canvasContext.getProgramInfoLog(program))
    canvasContext.deleteProgram(program)
    throw new Error('program problem, bruh')
  }

  use() {
    this._gl.useProgram(this._program)
  }

  get program() {
    return this._program
  }
}
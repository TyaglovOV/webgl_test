import { CanvasContext } from '../utils/utils'
import { VertexShader } from '../shaders/vertexShader'
import { FragmentShader } from '../shaders/fragmentShader'

type ProgramOptions = {
  transfromFeedbackVaryings?: string[],
  transfromFeedbackAttributes?: GLenum
}

// привязка шейдериков к программе
export class Program {
  _program: WebGLProgram
  _gl: CanvasContext

  constructor(gl: WebGL2RenderingContext, shaders: string[], options?: ProgramOptions) {
    const program = gl.createProgram()!

    gl.attachShader(program, new VertexShader(gl, shaders[0]).shader)
    gl.attachShader(program, new FragmentShader(gl, shaders[1]).shader)

    if (options?.transfromFeedbackVaryings?.length && options?.transfromFeedbackAttributes) {
      gl.transformFeedbackVaryings(program, options?.transfromFeedbackVaryings, options?.transfromFeedbackAttributes)
    }

    gl.linkProgram(program)

    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (linkStatus) {
      this._program = program
      this._gl = gl
      return
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    throw new Error('program problem, bruh')
  }

  use() {
    this._gl.useProgram(this._program)
  }

  get program() {
    return this._program
  }
}
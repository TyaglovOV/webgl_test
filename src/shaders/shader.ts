import { ShaderBase } from './shaderBase';
import { CanvasContext, getShaderType } from '../utils/utils';

export abstract class Shader {
  shader: WebGLShader = undefined

  constructor(canvasContext: CanvasContext, shaderBase: ShaderBase) {
    const shader = canvasContext.createShader(getShaderType(canvasContext, shaderBase.type)) // создание шейдера

    canvasContext.shaderSource(shader, shaderBase.source) // устанавливаем шейдеру его программный код
    canvasContext.compileShader(shader) // канпелируем шейдер

    const successfulCompile = canvasContext.getShaderParameter(shader, canvasContext.COMPILE_STATUS)

    if (successfulCompile) {
      this.shader = shader
      return
    }

    console.log(canvasContext.getShaderInfoLog(shader))
    canvasContext.deleteShader(shader)
    throw new Error('shader problem, bruh')
  }
}

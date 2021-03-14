import { GLSLShader, ShaderType } from '../utils';

export class ShaderBase {
  type: ShaderType
  source: GLSLShader

  constructor(type: ShaderType, source: GLSLShader) {
    this.type = type
    this.source = source
  }
}

import { CanvasContext, ShaderType } from '../utils/utils';
import { Shader } from './shader';
import { ShaderBase } from './shaderBase';

export class VertexShader extends Shader {
  constructor(canvasContext: CanvasContext, source: string) {
    super(canvasContext, new ShaderBase(ShaderType.Vertex, source))
  }
}
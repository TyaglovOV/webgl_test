import { CanvasContext, ShaderType } from '../utils';
import { Shader } from './shader';
import { ShaderBase } from './shaderBase';

export class FragmentShader extends Shader {
  constructor(canvasContext: CanvasContext, source: string) {
    super(canvasContext, new ShaderBase(ShaderType.Fragment, source))
  }
}
// import { getPixelByCoords, goldNoise } from '../../../utils/shaders';

const initialVertex = `
    attribute vec4 a_pointCoord;
    uniform float u_time;
    
    void main() {
      gl_PointSize = 2.0;
      vec2 newPos = a_pointCoord.xy + (normalize(a_pointCoord.zw) * u_time * 0.0001);
      gl_Position = vec4(newPos, 0.0, 1.0);
    }
  `

const initialFragment = `
    precision mediump float;
    
    void main() {
      gl_FragColor = vec4(1);
    }
  `

export const particlesShader = [initialVertex, initialFragment]

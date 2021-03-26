import { getPixelByCoords } from '../../../utils/shaderUtils';

const initialVertex = `
    attribute vec2 a_Position;
    attribute vec2 a_texCoord;
    
    varying vec2 v_texCoord;
    
    void main() {
      v_texCoord = a_texCoord;
      
      gl_Position = vec4(a_Position, 0.0, 1.0);
    }
  `

const initialFragment = `
    precision mediump float;
    
    uniform sampler2D u_sampler;
    uniform vec2 u_textureSize;
    uniform float u_seed;
    
    varying vec2 v_texCoord;
   
    
    float PHI = 1.61803398874989484820459;
    
    ${getPixelByCoords({ dx: 'dx', dy: 'dy' })}
    
    float goldNoise(vec2 xy, float seed) {
      return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);
    }
    
    void main() {
      int live = getPixelByCoords(0, 0);
      
      if (u_seed != 0.0 && goldNoise(gl_FragCoord.xy, u_seed) < 0.5) {
        gl_FragColor = vec4(1);
        
        return;
      }
      
      int neighbors =
        getPixelByCoords(-1, -1) +
        getPixelByCoords(0, -1) +
        getPixelByCoords(1, -1) +
        getPixelByCoords(-1, 0) +
        getPixelByCoords(1, 0) +
        getPixelByCoords(-1, 1) +
        getPixelByCoords(0, 1) +
        getPixelByCoords(1, 1);
        
      if (live == 1 && neighbors < 2)
          gl_FragColor = vec4(0);
      else if (live == 1 && (neighbors == 2 || neighbors == 3))
          gl_FragColor = vec4(1);
      else if (live == 1 && neighbors == 3)
          gl_FragColor = vec4(0);
      else if (live == 0 && neighbors == 3)
          gl_FragColor = vec4(1);
      else
          gl_FragColor = vec4(0);
     
    }
  `

export const lifeShaders = [initialVertex, initialFragment]

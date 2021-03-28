import { getPixelByCoords, goldNoise } from '../../../utils/shaders';

const initialVertex = `
    attribute vec2 a_Position;
    attribute vec2 a_texCoord;
    attribute vec2 a_pointCoord;
    
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
   
    ${getPixelByCoords({ dx: 'dx', dy: 'dy' })}
    
    ${goldNoise({xy: 'xy', seed: 'seed'})}
    
    void main() {
      int live = int(getPixelByCoords(0, 0).r);
      
      if (u_seed != 0.0 && goldNoise(gl_FragCoord.xy, u_seed) < 0.5) {
        gl_FragColor = vec4(1);
        
        return;
      }
      
      int neighbors =
        int(getPixelByCoords(-1, -1).r +
        getPixelByCoords(0, -1).r +
        getPixelByCoords(1, -1).r +
        getPixelByCoords(-1, 0).r +
        getPixelByCoords(1, 0).r +
        getPixelByCoords(-1, 1).r +
        getPixelByCoords(0, 1).r +
        getPixelByCoords(1, 1).r);
        
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

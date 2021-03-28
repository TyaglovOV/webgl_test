const initialVertex = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    
    varying vec2 v_texCoord;
    
    void main() {
      v_texCoord = a_texCoord;
      
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `

const initialFragment = `
    precision mediump float;
    
    uniform sampler2D u_sampler;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec4 tex = texture2D(u_sampler, v_texCoord);

      gl_FragColor = tex;
    }
  `

export const trackShader = [initialVertex, initialFragment]

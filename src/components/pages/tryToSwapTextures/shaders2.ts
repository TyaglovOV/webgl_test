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
    uniform float u_line;
    uniform float u_line2;
    
    varying vec2 v_texCoord;
    
    void main() {
      if (gl_FragCoord.x - 0.5 == u_line || gl_FragCoord.y - 0.5 == u_line) {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
        return;
      }
      if (gl_FragCoord.x - 0.5 == u_line2 || gl_FragCoord.y - 0.5 == u_line2) {
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
        return;
      }
      
      gl_FragColor = texture2D(u_sampler, v_texCoord);
    }
  `

export const tryToSwapShaders2 = [initialVertex, initialFragment]

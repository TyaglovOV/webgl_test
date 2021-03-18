const initialVertex = `
    attribute vec3 a_Position;
    attribute vec2 a_uv;
    
    uniform mat4 u_Pmatrix;
    uniform mat4 u_Mmatrix;
    uniform mat4 u_Vmatrix;
    
    varying vec2 v_uv;
    
    void main() {
      v_uv = a_uv;
      
      gl_Position = u_Pmatrix * u_Mmatrix * u_Vmatrix * vec4(a_Position, 1.0);
    }
  `

const initialFragment = `
    precision mediump float;
    
    uniform sampler2D sampler;
    
    varying vec2 v_uv;
    
    void main() {
      gl_FragColor = texture2D(sampler, v_uv);
    }
  `

export const textureLesson1Shaders = [initialVertex, initialFragment]

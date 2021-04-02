const initialVertex = `
  attribute vec4 position;
  uniform mat4 u_matrix;

  void main() {
    // do the common matrix math
    gl_Position = u_matrix * position;
    gl_PointSize = 10.0;
  }
  `

const initialFragment = `
  precision highp float;
  
  void main() {
    gl_FragColor = vec4(1, 1, 0, 1);
  }
  `

export const particlesShader = [initialVertex, initialFragment]

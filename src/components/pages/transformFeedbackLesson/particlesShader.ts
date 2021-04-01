const initialVertex = `#version 300 es
  in vec4 position;
  uniform mat4 u_matrix;

  void main() {
    // do the common matrix math
    gl_Position = u_matrix * position;
    gl_PointSize = 10.0;
  }
  `

const initialFragment = `#version 300 es
  precision highp float;
  out vec4 outColor;
  void main() {
    outColor = vec4(1, 0, 0, 1);
  }
  `

export const particlesShader = [initialVertex, initialFragment]

const initialVertex = `
    attribute vec2 a_pointCoord;
    uniform float u_time;
    
    void main() {
      gl_PointSize = 2.0;
      
      float distance = sqrt(a_pointCoord.x * a_pointCoord.x + a_pointCoord.y * a_pointCoord.y);
      
      float x = a_pointCoord.x + distance * cos(u_time * 0.001);
      float y = a_pointCoord.y + distance * sin(u_time * 0.001);
      
      
      // float dotProduct = (1.0 - a_pointCoord.x) + (1.0 - a_pointCoord.y);
      // float x = a_pointCoord.x + distance * cos(acos(dotProduct) * u_time * 0.001);
      // float y = a_pointCoord.y + distance * sin(acos(dotProduct) * u_time * 0.001);
      
      // vec2 newPos = a_pointCoord.xy + (vec2(1.0 * a_pointCoord.y, -1.0 * a_pointCoord.x)) * sin(u_time * 0.001);
      // vec2 newPos = vec2(-a_pointCoord.y + a_pointCoord.y * sin(u_time * 0.0003), a_pointCoord.x + a_pointCoord.x * cos(u_time * 0.0003));
      
      gl_Position = vec4(x, y, 0.0, 1.0);
    }
  `

const initialFragment = `
    precision mediump float;
    
    void main() {
      gl_FragColor = vec4(1);
    }
  `

export const particlesShader = [initialVertex, initialFragment]

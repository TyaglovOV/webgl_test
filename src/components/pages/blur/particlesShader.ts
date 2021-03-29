const initialVertex = `
    #define PI 3.1415926
    attribute vec2 a_pointCoord;
    uniform float u_time;
    
    void main() {
      gl_PointSize = 2.0;
      float deltaTime = u_time * 0.0001;
      float theta = 5.0;
      float alpha = 0.0;
      
      float distance1 = distance(a_pointCoord, vec2(0.0, 0.0)) / 2.0;
      
      float inRads = acos(a_pointCoord.x / distance1) * 180.0 / PI;
      
      float x = distance1 * cos(deltaTime * pow((3.0 / distance1), 0.9) + PI + inRads);
      float y = distance1 * sin(deltaTime * pow((3.0 / distance1), 0.9) + PI + inRads);
      
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

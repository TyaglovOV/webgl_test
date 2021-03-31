import { goldNoise } from '../../../utils/shaders';

const initialVertex = `
    #define PI 3.1415926
    attribute vec2 a_pointCoord;
    uniform float u_time;
    varying float v_brightness;
    const float rotSpeedMultiplier = 0.0001; 
    
    ${goldNoise({})}
    
    void main() {
      gl_PointSize = 2.0;
      float maxLifeTime = 500.0 + floor((a_pointCoord.x * 2.0 - 1.0) * 200.0);
      float lifetime = mod(u_time, maxLifeTime);
      float deltaTime = u_time * 0.0001;
      float distance1 = distance(a_pointCoord, vec2(0.0, 0.0)) * 0.5;
      float variableDistance = (distance1 * maxLifeTime * 2.0) / (maxLifeTime + lifetime) + 0.015; 
      
      float inRads = acos(a_pointCoord.x / distance1) * 180.0 / PI;
      
      v_brightness = min(1.0, (maxLifeTime + lifetime * 2.0) / (maxLifeTime * 3.0));
      
      float x = variableDistance * cos(u_time * rotSpeedMultiplier * pow((1.0 / variableDistance), 2.0) + inRads);
      float y = variableDistance * sin(u_time * rotSpeedMultiplier * pow((1.0 / variableDistance), 2.0) + inRads);
      
      gl_Position = vec4(x, y, 0.0, 1.0);
    }
  `

const initialFragment = `
    precision mediump float;
    varying float v_brightness;
    
    void main() {
      gl_FragColor = vec4(v_brightness);
    }
  `

export const particlesShader = [initialVertex, initialFragment]
